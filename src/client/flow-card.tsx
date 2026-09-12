/**
 * dsh-chat-flow — 对话流卡片外壳（client）。
 *
 * 两种卡（自 webui flow-card.tsx 移植）：
 *  - **步骤卡**（`variant="step"`）：回合中间的 assistant 片段，极轻量——只有
 *    一条左侧竖线 + 淡纱，用来在视觉上把「一步」圈起来，不抢主回复的注意力。
 *  - **总结卡**（`variant="reply"`）：回合最终回复。带头部（完成标记 + 本轮
 *    统计 chip：用时 / 步数 / Git 次数）与顶部高光，正文用官方 MarkdownText
 *    渲染（流式期不包卡，见 thinking/ThinkingStepNodeView）。抽屉入口不在
 *    这里（紧凑 closed 回合走 control 影子行，其余走成员自有行）。
 *
 * 统计数字全部来自已有的会话投影（TurnLocation 的 start/end 事件、本回合的
 * assistant step 与 tool-call 节点数），不新增任何轮询或订阅。
 */
import type { ReactNode } from 'react'

/** 本轮统计（全部可缺省）。 */
export interface ReplyCardMeta {
  /** 本回合总耗时（ms）。 */
  readonly durationMs?: number | undefined
  /** 本回合 assistant 步数。 */
  readonly steps?: number | undefined
  /** 本回合工具调用次数。 */
  readonly tools?: number | undefined
  /** 本回合思考段数。 */
  readonly thinking?: number | undefined
  /** 本回合 git 相关调用次数。 */
  readonly git?: number | undefined
  /** git 动词摘要（add · commit · push），放 chip title。 */
  readonly gitDetail?: string | undefined
}

/** 卡片外壳：step 轻量竖线卡、reply 总结卡。正常完成仅保留纯净卡片外壳；仅在中断时展示「已中断」头。 */
export function FlowCard({ variant, interrupted, children }: {
  readonly variant: 'step' | 'reply'
  readonly meta?: ReplyCardMeta | undefined
  readonly interrupted?: boolean | undefined
  readonly children: ReactNode
}): JSX.Element {
  if (variant === 'step') {
    return <div className="dtt__card dtt__card--step">{children}</div>
  }
  return (
    <div
      className="dtt__card dtt__card--reply"
      data-interrupted={interrupted === true ? '' : undefined}
    >
      {interrupted === true && (
        <div className="dtt__card-head">
          <span className="dtt__card-badge" data-interrupted="">
            已中断
          </span>
        </div>
      )}
      <div className="dtt__card-body">{children}</div>
    </div>
  )
}
