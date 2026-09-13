/**
 * dsh-chat-flow — 提问行接管（keyed `tool.call.toolview`，key = ask_user_question）。
 *
 * 为什么要接管：官方 AskQuestionRow 把「问题 + 所选答案」的问答卡放在
 * DisclosureRow 的**展开体**里（源码就是 `{open && children}`——折叠时整段根本不
 * 挂 DOM）。于是回合跑完再回看，卡片只剩「提问 · 2/2 已回答」一行，问题原文
 * 必须手动点「查看」才看得到。本视图把问答卡改成**常驻**：永远渲染在行下方，
 * 折叠与否都在；「查看」展开的换成原始 args / result JSON（信息严格变多，
 * 也不与常驻区重复）。
 *
 * 槽位契约：keyed `tool.call.toolview` 对官方已覆盖的 key 是**替换**而非共享
 * （见 ui-tool contract 注释「a key the shipped composition already covers is
 * replaced, not shared」），所以官方行的每一个分支都得自己覆盖齐：
 * running / 已回答 / ASK_CANCELLED / ASK_ABORTED / 其他 error。
 * 文案一律走官方 conversation locale 键（注册时声明 locale: 'conversation'），
 * 中英自动切换，插件不自带第二套字符串。
 *
 * 兜底：问答解析不出来 → 只剩行（与官方折叠态等价，不会更差）；渲染期异常 →
 * ErrorBoundary 收起成一行纯文本，绝不把整条 tool 行弄没。
 */
import { memo, useMemo, useState } from 'react'
import { DisclosureRow, IconQuestionOutline14, StateDot } from '@deepseek-ai/dsh-client-ui-primitives'
import type { ToolCallViewProps } from '@deepseek-ai/dsh-client-ui-tool/client'
import { ErrorBoundary } from '../error-boundary.tsx'

/** 官方 locale 的 t 形状（这里只用 ask.* 几个键）。 */
type AskT = (key: string, params?: Record<string, string | number>) => string

/**
 * t 的保险套：接管官方行意味着「槽位没把 conversation locale 注进来」这种
 * 装配意外会直接白屏，所以真 t 优先（异常也吞），拿不到才退回与官方 zh 词典
 * 逐字一致的内置文案——只为兜底，不作为第二套语言来源。
 */
const ASK_FALLBACK: Record<string, string> = {
  'ask.rowTitle': '提问',
  'ask.waiting': '等待回答',
  'ask.cancelled': '已取消',
  'ask.cancelledDetail': '本轮已取消，未提交回答',
  'ask.interrupted': '已中断',
  'ask.interruptedDetail': '本轮已中断，未提交回答',
  'ask.skipped': '未回答',
}

function askT(real: unknown): AskT {
  const fn = typeof real === 'function' ? (real as AskT) : undefined
  return (key, params) => {
    if (fn !== undefined) {
      try {
        const value = fn(key, params)
        if (typeof value === 'string' && value !== '' && value !== key) return value
      } catch {
        // 落到内置文案
      }
    }
    if (key === 'ask.answered') return `${String(params?.answered ?? 0)}/${String(params?.total ?? 0)} 已回答`
    return ASK_FALLBACK[key] ?? ''
  }
}

/** 一问（args 文档里的稳定 id + 原文）。 */
interface AskQuestion {
  readonly id: string
  readonly question: string
}

/** 一答（result 文档里按 id 回显）。 */
interface AskAnswer {
  readonly id: string
  readonly selected: readonly string[]
  readonly custom?: string | undefined
}

/** 常驻问答卡的内容：已回答 = 问答成对；未回答（取消/中断/等待）= 只有问题。 */
type AskTranscript
  = { readonly kind: 'answered'; readonly items: readonly (AskQuestion & { readonly answers: readonly string[] })[]; readonly skippedLabel: string }
  | { readonly kind: 'unanswered'; readonly questions: readonly AskQuestion[]; readonly verdict: string }

/** 行的生命周期态（与官方 ToolRow 同名同义，驱动图标与扫光）。 */
type AskState = 'running' | 'ok' | 'error' | 'stopped'

function parseJson(raw: string): unknown {
  try {
    return JSON.parse(raw)
  } catch {
    return undefined
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

/** args 文档 → 问题列表；结构不合预期返回 null（宁可不渲染也不猜）。 */
function questionEntries(argsRaw: string): readonly AskQuestion[] | null {
  const parsed = parseJson(argsRaw)
  if (!isRecord(parsed) || !Array.isArray(parsed.questions) || parsed.questions.length === 0) return null
  const questions: AskQuestion[] = []
  const ids = new Set<string>()
  for (const item of parsed.questions) {
    if (!isRecord(item) || typeof item.id !== 'string' || typeof item.question !== 'string' || ids.has(item.id)) return null
    ids.add(item.id)
    questions.push({ id: item.id, question: item.question })
  }
  return questions
}

/** result 文档 → 答案条目（selected + 可选 custom）。 */
function answerEntries(text: string): readonly AskAnswer[] | null {
  const parsed = parseJson(text)
  if (!isRecord(parsed) || !Array.isArray(parsed.answers) || !parsed.answers.every(isRecord)) return null
  const entries: AskAnswer[] = []
  for (const item of parsed.answers) {
    const record = item as Record<string, unknown>
    if (typeof record.id !== 'string' || !Array.isArray(record.selected)) return null
    const selected = record.selected
    if (!selected.every((entry): entry is string => typeof entry === 'string')) return null
    if (record.custom !== undefined && typeof record.custom !== 'string') return null
    entries.push({ id: record.id, selected, ...(record.custom === undefined ? {} : { custom: record.custom as string }) })
  }
  return entries
}

/** 按 id 把问答配对；配不齐（数量/ id 不吻合）返回 null，交给兜底文案。 */
function pairAnswers(questions: readonly AskQuestion[], answers: readonly AskAnswer[]): readonly (AskQuestion & { readonly answers: readonly string[] })[] | null {
  if (questions.length !== answers.length) return null
  const byId = new Map<string, AskAnswer>()
  for (const answer of answers) {
    if (byId.has(answer.id)) return null
    byId.set(answer.id, answer)
  }
  const paired: (AskQuestion & { readonly answers: readonly string[] })[] = []
  for (const question of questions) {
    const answer = byId.get(question.id)
    if (answer === undefined) return null
    const merged = [...answer.selected, ...(answer.custom === undefined || answer.custom === '' ? [] : [answer.custom])]
    paired.push({ ...question, answers: merged })
  }
  return paired
}

/** 结果文本（只有单条 text 内容时才当作问答文档）。 */
function singleResultText(block: ToolCallViewProps['block']): string | undefined {
  const content = (block as unknown as { content?: unknown }).content
  if (!Array.isArray(content) || content.length !== 1) return undefined
  const only = content[0]
  if (!isRecord(only) || only.type !== 'text' || typeof only.text !== 'string') return undefined
  return only.text
}

/** 展开体：原始 args（有结果再附上 result），JSON 美化失败就原样。 */
function rawBody(argsRaw: string, resultText: string | undefined): string {
  const args = parseJson(argsRaw)
  const argsText = args === undefined ? argsRaw : JSON.stringify(args, null, 2)
  if (resultText === undefined) return argsText
  const result = parseJson(resultText)
  return `${argsText}\n\n${result === undefined ? resultText : JSON.stringify(result, null, 2)}`
}

/** 行首图标：与官方 ToolRow 同规则（error 红点 / stopped 琥珀点 / 其余问号）。 */
function Leading({ state }: { readonly state: AskState }): JSX.Element {
  if (state === 'error') return <StateDot state="error" />
  if (state === 'stopped') return <StateDot state="warning" />
  return <IconQuestionOutline14 />
}

/** 常驻问答卡。 */
function AskCard({ transcript }: { readonly transcript: AskTranscript }): JSX.Element {
  if (transcript.kind === 'unanswered') {
    return (
      <div className="dtt__ask-card">
        <p className="dtt__ask-verdict">{transcript.verdict}</p>
        <ul className="dtt__ask-list">
          {transcript.questions.map(question => (
            <li key={question.id} className="dtt__ask-question">{question.question}</li>
          ))}
        </ul>
      </div>
    )
  }
  return (
    <dl className="dtt__ask-card">
      {transcript.items.map(item => (
        <div key={item.id} className="dtt__ask-item">
          <dt className="dtt__ask-question">{item.question}</dt>
          <dd className="dtt__ask-answer">
            {item.answers.length > 0
              ? item.answers.map(answer => <span key={answer} className="dtt__ask-answer-line">{answer}</span>)
              : <span className="dtt__ask-skipped">{transcript.skippedLabel}</span>}
          </dd>
        </div>
      ))}
    </dl>
  )
}

function AskRowInner(props: ToolCallViewProps): JSX.Element {
  const { block } = props
  const t = askT(props.t)
  const [open, setOpen] = useState(false)

  const settled = 'kind' in block
  const shape = block as unknown as {
    call?: { argsRaw?: string }
    argsRaw?: string
    error?: { code?: string; message?: string }
    isError?: boolean
  }
  const argsRaw = (settled ? shape.call?.argsRaw : shape.argsRaw) ?? ''
  const code = settled ? shape.error?.code : undefined
  const baseState: AskState = !settled
    ? 'running'
    : code === 'interrupted' ? 'stopped' : shape.isError === true ? 'error' : 'ok'

  const questions = useMemo(() => questionEntries(argsRaw), [argsRaw])
  const resultText = settled ? singleResultText(block) : undefined
  const errorMessage = settled ? shape.error?.message : undefined
  const presentation = useMemo<{ summary: string; transcript: AskTranscript | null; state: AskState } | null>(() => {
    if (code === 'ASK_CANCELLED') {
      return {
        summary: t('ask.cancelled'),
        state: 'ok',
        transcript: questions !== null ? { kind: 'unanswered', questions, verdict: t('ask.cancelledDetail') } : null,
      }
    }
    if (code === 'ASK_ABORTED') {
      return {
        summary: t('ask.interrupted'),
        state: 'stopped',
        transcript: questions !== null ? { kind: 'unanswered', questions, verdict: t('ask.interruptedDetail') } : null,
      }
    }
    if (baseState === 'running') {
      return {
        summary: t('ask.waiting'),
        state: 'running',
        transcript: questions !== null ? { kind: 'unanswered', questions, verdict: t('ask.waiting') } : null,
      }
    }
    if (baseState === 'ok') {
      const answers = resultText !== undefined ? answerEntries(resultText) : null
      const paired = answers !== null && questions !== null ? pairAnswers(questions, answers) : null
      const answered = answers === null ? 0 : answers.filter(answer => answer.selected.length > 0 || (answer.custom ?? '') !== '').length
      const summary = answers === null ? '' : t('ask.answered', { answered, total: answers.length })
      return {
        summary,
        state: 'ok',
        transcript: paired !== null ? { kind: 'answered', items: paired, skippedLabel: t('ask.skipped') } : null,
      }
    }
    return {
      summary: errorMessage ?? '',
      state: baseState,
      transcript: questions !== null ? { kind: 'unanswered', questions, verdict: errorMessage ?? '' } : null,
    }
  }, [baseState, code, errorMessage, questions, resultText, t])

  const body = open ? rawBody(argsRaw, resultText) : ''

  return (
    <div className="dtt__ask-root" data-state={presentation?.state ?? baseState} data-tool="ask_user_question">
      <DisclosureRow
        rowClassName="dtt__ask-row"
        leadingClassName="dtt__ask-leading"
        titleClassName="dtt__ask-title"
        chevronClassName="dtt__ask-chevron"
        icon={<Leading state={presentation?.state ?? baseState} />}
        title={t('ask.rowTitle')}
        open={open}
        expandable={body !== ''}
        expandOnRowClick={true}
        onToggle={() => { setOpen(value => !value) }}
        collapsedContent={(presentation?.summary ?? '') !== '' && (
          <>
            <span className="dtt__ask-sep" aria-hidden="true" />
            <span className="dtt__ask-summary">{presentation?.summary ?? ''}</span>
          </>
        )}
      >
        <pre className="dtt__ask-raw">{body}</pre>
      </DisclosureRow>
      {presentation?.transcript !== null && presentation?.transcript !== undefined && (
        <AskCard transcript={presentation.transcript} />
      )}
    </div>
  )
}

/** 崩溃兜底：至少留一行「提问」，不吞掉这次调用。 */
function AskRowFallback(props: ToolCallViewProps): JSX.Element {
  const t = askT(props.t)
  return (
    <div className="dtt__ask-root" data-state="ok" data-tool="ask_user_question">
      <div className="dtt__ask-row dtt__ask-fallback">
        <Leading state="ok" />
        <span className="dtt__ask-title">{t('ask.rowTitle')}</span>
      </div>
    </div>
  )
}

/** keyed toolview 入口（带错误边界）。 */
export const AskRowView = memo(function AskRowView(props: ToolCallViewProps): JSX.Element {
  return (
    <ErrorBoundary label="ask row" fallback={<AskRowFallback {...props} />}>
      <AskRowInner {...props} />
    </ErrorBoundary>
  )
})
