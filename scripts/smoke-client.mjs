/**
 * dsh-chat-flow — browser half smoke test.
 *
 * Executes `lib/client.js` under a stubbed DSH client environment and asserts:
 *   1. registers exactly one `__ModuleLoader__` entry with id "dsh-chat-flow"
 *   2. the factory exports `apply` (function) and `inject` (array = ['slots'])
 *   3. `apply(ctx)` mounts the shared activity drawer (body 级宿主) + 注入七枚
 *      <style>（dsh-chat-flow-styles / dsh-tool-summary-styles /
 *      dsh-chat-flow-shot-styles / dsh-modal-animation-styles /
 *      dsh-chat-flow-proto-styles / dsh-chat-flow-diagram-styles /
 *      dsh-chat-flow-download-styles）
 *   4. `apply(ctx)` registers all seats：
 *        conversation.chat.node / assistant-step   priority -100  locale chat
 *        conversation.chat.assistant-actions / chat-flow-screenshot  order 5
 *        tool.call.toolview / download             (keyed by wire tool name)
 *        tool.call.toolview / ask_user_question    locale conversation
 *   5. 提问行真渲染一遍（折叠态）：问题原文 + 所选答案常驻在行下方，
 *      summary 走官方 ask.answered 计数，未作答回落 ask.skipped，
 *      等待态与 ASK_CANCELLED 态各自带 verdict + 问题清单。
 *
 * Usage: node scripts/smoke-client.mjs
 */

import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..')
const CLIENT = resolve(ROOT, 'lib/client.js')

/** Stand-in for any React component export. */
function stubComponent(name) {
  const Comp = () => ({ __stub: name })
  Object.defineProperty(Comp, 'name', { value: name })
  return Comp
}

/** Minimal DOM node (records id / children / styles for later assertions). */
function stubNode(tag = 'div') {
  const node = {
    tagName: String(tag).toUpperCase(),
    children: [],
    style: {},
    dataset: {},
    classList: { add: () => {}, remove: () => {}, toggle: () => {}, contains: () => false },
    attrs: {},
    id: '',
    textContent: '',
    appendChild(child) { node.children.push(child); return child },
    insertBefore(child) { node.children.unshift(child); return child },
    removeChild(child) {
      const i = node.children.indexOf(child)
      if (i >= 0) node.children.splice(i, 1)
      return child
    },
    remove() {},
    setAttribute(k, v) { node.attrs[k] = v },
    getAttribute(k) { return node.attrs[k] ?? null },
    removeAttribute(k) { delete node.attrs[k] },
    addEventListener() {},
    removeEventListener() {},
    querySelector: () => null,
    querySelectorAll: () => [],
    getBoundingClientRect: () => ({ x: 0, y: 0, top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 }),
    contains: () => false,
    compareDocumentPosition: () => 0,
    getRootNode: () => sandbox.document,
    focus: () => {},
    click: () => {},
    ownerDocument: null,
  }
  return node
}

/** Explicit React overrides. */
const REACT_OVERRIDES = {
  createElement: (type, props, ...children) => ({ type, props, children }),
  cloneElement: (el) => el,
  isValidElement: () => false,
  Children: { map: () => [], forEach: () => {}, count: () => 0, toArray: () => [] },
  Fragment: Symbol('Fragment'),
  Component: class Component {
    constructor(props) {
      this.props = props
      this.state = null
    }

    setState() {}

    forceUpdate() {}

    render() {
      return null
    }
  },
  StrictMode: stubComponent('StrictMode'),
  Suspense: stubComponent('Suspense'),
  memo: (comp) => comp,
  forwardRef: (render) => render,
  lazy: () => stubComponent('Lazy'),
  startTransition: (fn) => fn?.(),
  createRef: () => ({ current: null }),
  createContext: () => ({ Provider: stubComponent('Provider'), Consumer: stubComponent('Consumer') }),
  useState: (init) => [typeof init === 'function' ? init() : init, () => {}],
  useReducer: (reducer, init) => [init, () => {}],
  useEffect: () => {},
  useLayoutEffect: () => {},
  useInsertionEffect: () => {},
  useMemo: (fn) => fn(),
  useCallback: (fn) => fn,
  useRef: (init) => ({ current: init }),
  useImperativeHandle: () => {},
  useContext: () => ({}),
  useId: () => 'stub-id',
  useDebugValue: () => {},
  useSyncExternalStore: (_sub, get) => get(),
  useTransition: () => [false, (fn) => fn?.()],
  useDeferredValue: (v) => v,
}

/** Everything the bundle may ask the platform for. */
const MODULES = {
  'react': new Proxy(REACT_OVERRIDES, {
    get: (target, prop) => {
      if (typeof prop !== 'string') return undefined
      if (Object.hasOwn(target, prop)) return target[prop]
      return stubComponent(prop)
    },
    has: () => true,
  }),
  'react/jsx-runtime': {
    jsx: (type, props) => ({ type, props }),
    jsxs: (type, props) => ({ type, props }),
    Fragment: Symbol('Fragment'),
  },
  'react-dom': { createPortal: (node) => node },
  'react-dom/client': { createRoot: () => ({ render: () => {}, unmount: () => {} }) },
  '@deepseek-ai/dsh-client-ui-primitives': {
    IconThinkOutline14: stubComponent('IconThinkOutline14'),
    IconApiOutline14: stubComponent('IconApiOutline14'),
    IconDownloadOutline16: stubComponent('IconDownloadOutline16'),
    JsonBlock: stubComponent('JsonBlock'),
    MarkdownText: stubComponent('MarkdownText'),
    // DisclosureRow 要能把「折叠区 + 展开体」透出来，否则测不到折叠态下还剩什么文字。
    DisclosureRow: (props) => ({
      type: 'div',
      props: { children: [props.collapsedContent, props.open ? props.children : null] },
    }),
  },
}

// ── capture the loader registration ──────────────────────────────────────
const registrations = []
const headItems = []
const bodyItems = []
const sandbox = {
  __ModuleLoader__: { load: (entry) => { registrations.push(entry) } },
  document: {
    head: stubNode('head'),
    body: stubNode('body'),
    documentElement: stubNode('html'),
    createElement: (tag) => stubNode(tag),
    createTextNode: (text) => ({ nodeType: 3, textContent: text }),
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementById: () => null,
    getElementsByTagName: () => [],
    addEventListener: () => {},
    removeEventListener: () => {},
  },
  console,
  setTimeout: (() => { let id = 0; return (fn, ms) => { void fn; void ms; return ++id } })(),
  clearTimeout: () => {},
  setInterval: (() => { let id = 0; return (fn, ms) => { void fn; void ms; return ++id } })(),
  clearInterval: () => {},
  queueMicrotask: (fn) => fn(),
  fetch: async () => ({ ok: false, status: 599, json: async () => ({}) }),
  AbortController,
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  matchMedia: () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} }),
  requestAnimationFrame: (fn) => setTimeout(() => fn(Date.now()), 0),
  cancelAnimationFrame: (id) => clearTimeout(id),
  getComputedStyle: () => ({ getPropertyValue: () => '' }),
  MutationObserver: class { observe() {} disconnect() {} },
  ResizeObserver: class { observe() {} unobserve() {} disconnect() {} },
  CSS: { supports: () => () => '' },
  Element: class {},
  HTMLElement: class {},
  Node: class {},
}
sandbox.window = sandbox
sandbox.globalThis = sandbox
sandbox.self = sandbox
sandbox.top = sandbox
sandbox.parent = sandbox
sandbox.location = { href: 'http://127.0.0.1:0/', origin: 'http://127.0.0.1:0', protocol: 'http:', host: '127.0.0.1:0' }
sandbox.navigator = { userAgent: 'dsh-chat-flow-smoke', language: 'zh-CN', maxTouchPoints: 0 }
sandbox.innerWidth = 1440
sandbox.innerHeight = 900
sandbox.devicePixelRatio = 1
sandbox.addEventListener = () => {}
sandbox.removeEventListener = () => {}
sandbox.dispatchEvent = () => true
sandbox.scrollTo = () => {}

// 记录 document 挂载点（head 的 style + body 的抽屉宿主）。
const originalHeadAppend = sandbox.document.head.appendChild.bind(sandbox.document.head)
sandbox.document.head.appendChild = (child) => {
  headItems.push(child)
  return originalHeadAppend(child)
}
const originalBodyAppend = sandbox.document.body.appendChild.bind(sandbox.document.body)
sandbox.document.body.appendChild = (child) => {
  bodyItems.push(child)
  return originalBodyAppend(child)
}

const context = vm.createContext(sandbox)
const code = readFileSync(CLIENT, 'utf8')
new vm.Script(code, { filename: CLIENT }).runInContext(context)

// ── assertions ───────────────────────────────────────────────────────────
const fail = (msg) => { console.error(`FAIL  ${msg}`); process.exitCode = 1 }
const pass = (msg) => console.log(`ok    ${msg}`)

if (registrations.length !== 1) fail(`expected 1 loader registration, got ${registrations.length}`)
else pass('registered exactly one __ModuleLoader__ entry')

const entry = registrations[0]
if (entry?.id !== 'dsh-chat-flow') fail(`expected id "dsh-chat-flow", got ${JSON.stringify(entry?.id)}`)
else pass('loader id is "dsh-chat-flow"')

const require = (id) => {
  if (id in MODULES) return MODULES[id]
  throw new Error(`[smoke] unexpected require(${id}) — add it to the stub table`)
}

const mod = entry.factory(require)
if (typeof mod.apply !== 'function') fail('factory did not export apply()')
else pass('factory exports apply()')
if (!Array.isArray(mod.inject)) fail('factory did not export inject[]')
else pass(`factory exports inject[] = [${mod.inject.join(', ')}]`)
if (JSON.stringify(mod.inject) !== JSON.stringify(['slots'])) {
  fail(`expected inject = ['slots'], got [${mod.inject.join(', ')}]`)
} else {
  pass('client inject = ["slots"]')
}

// ── run apply() against a stub client context ────────────────────────────
const registeredSlots = []
const slotsService = {
  inject: (slot, factory) => {
    if (typeof factory !== 'function') throw new Error('slots.inject expects a factory')
    factory()
  },
  register: (spec, comp) => {
    if (comp === undefined) throw new Error('slots.register called without component')
    registeredSlots.push({
      slot: spec?.name, key: spec?.key, priority: spec?.priority, locale: spec?.locale,
      id: spec?.id, order: spec?.order, comp,
    })
    return () => {}
  },
}
const ctx = {
  effect: (fn) => { const stop = typeof fn === 'function' ? fn() : undefined; return stop ?? (() => {}) },
  get: () => undefined,
  slots: slotsService,
  inject: (names, fn) => {
    if (!Array.isArray(names)) throw new Error('ctx.inject expects a names array')
    fn({ slots: slotsService })
  },
}

try {
  mod.apply(ctx)
  pass('apply(ctx) ran without throwing')
} catch (error) {
  fail(`apply(ctx) threw: ${error?.stack ?? error}`)
}

// 活动抽屉宿主挂到 body。
const drawerHost = bodyItems.find((item) => item?.id === 'dsh-activity-drawer-root')
if (drawerHost === undefined) fail('activity drawer host was not appended to document.body')
else pass('activity drawer host mounted on document.body')

// 四枚 <style> 注入 head。
const styleIds = headItems.filter((item) => item?.tagName === 'STYLE').map((item) => item?.id ?? '')
for (const expected of [
  'dsh-chat-flow-styles', 'dsh-tool-summary-styles',
  'dsh-chat-flow-shot-styles', 'dsh-modal-animation-styles',
  'dsh-chat-flow-proto-styles', 'dsh-chat-flow-diagram-styles',
  'dsh-chat-flow-download-styles',
]) {
  if (!styleIds.includes(expected)) fail(`missing injected <style id=${expected}>`)
}
if (styleIds.length === 7) pass('injected seven <style> sheets (dtt__ + dts__ + tsh__ + modal + proto + diagram + download)')
else if (styleIds.length > 7) fail(`unexpected extra styles: ${styleIds.join(', ')}`)

// 注册槽位：1 个 keyed 槽位（assistant-step）+ 截图按钮 + download toolview
// + ask_user_question toolview（问答卡常驻）
const cell = (key) => registeredSlots.find((s) => s?.slot === 'conversation.chat.node' && s?.key === key)
if (registeredSlots.length !== 4) {
  fail(`expected 4 slot registrations, got ${registeredSlots.length}: ${JSON.stringify(registeredSlots)}`)
} else {
  pass(`registered ${registeredSlots.length} seats (1 chat-node keyed + 1 actions + 2 toolview)`)
}
const downloadSeat = registeredSlots.find((s) => s?.slot === 'tool.call.toolview' && s?.key === 'download')
if (downloadSeat === undefined) fail('missing keyed toolview seat tool.call.toolview / download')
else pass('seat tool.call.toolview / download (keyed by wire tool name)')
const askSeat = registeredSlots.find((s) => s?.slot === 'tool.call.toolview' && s?.key === 'ask_user_question')
if (askSeat === undefined) {
  fail('missing keyed toolview seat tool.call.toolview / ask_user_question')
} else if (askSeat.locale !== 'conversation') {
  fail(`ask toolview locale = ${JSON.stringify(askSeat.locale)}, expected "conversation"`)
} else {
  pass('seat tool.call.toolview / ask_user_question (official row replaced, ask.* keys from conversation locale)')
}

// ── 提问行常驻渲染：折叠态也必须含问题原文与所选答案 ────────────────────
// 官方 AskQuestionRow 的问答卡在展开体里（open 为假就不渲染），本插件把它
// 搬到行下方常驻。这里把组件真正调用一遍，按折叠态（useState 桩返回初值
// false）收集全部文本，缺内容即判失败。
function collectText(node, out) {
  if (node === null || node === undefined || node === false || node === true) return out
  if (typeof node === 'string') { out.push(node); return out }
  if (typeof node === 'number') { out.push(String(node)); return out }
  if (Array.isArray(node)) {
    for (const item of node) collectText(item, out)
    return out
  }
  if (typeof node !== 'object') return out
  const type = node.type
  const props = node.props ?? {}
  if (typeof type === 'function') {
    const rendered = type.prototype && typeof type.prototype.render === 'function'
      ? new type(props).render()
      : type(props)
    return collectText(rendered, out)
  }
  if ('children' in props) collectText(props.children, out)
  return out
}

const askLocale = (key, params) => {
  if (key === 'ask.answered') return `${params.answered}/${params.total} 已回答`
  const table = {
    'ask.rowTitle': '提问',
    'ask.waiting': '等待回答',
    'ask.skipped': '未回答',
    'ask.cancelled': '已取消',
    'ask.cancelledDetail': '本轮已取消，未提交回答',
    'ask.interrupted': '已中断',
    'ask.interruptedDetail': '本轮已中断，未提交回答',
  }
  return table[key] ?? key
}

const askArgs = JSON.stringify({
  questions: [
    { id: 'q1', question: '要按哪种方式还原？' },
    { id: 'q2', question: '要不要顺手推送？' },
  ],
})
const askProps = (block) => ({ callId: 'c1', toolName: 'ask_user_question', block, t: askLocale, openFile: () => {}, loadImage: () => {} })

if (askSeat?.comp === undefined) {
  fail('ask toolview component was not captured')
} else {
  const answered = collectText(askSeat.comp(askProps({
    kind: 'result',
    call: { argsRaw: askArgs },
    content: [{ type: 'text', text: JSON.stringify({ answers: [{ id: 'q1', selected: ['总结卡入口 chip'] }, { id: 'q2', selected: [] }] }) }],
    isError: false,
  })), []).join('\n')
  if (answered.includes('要按哪种方式还原？') && answered.includes('总结卡入口 chip')) {
    pass('ask row 折叠态常驻问答：问题原文与所选答案都在')
  } else {
    fail(`ask row 折叠态缺内容：${answered.slice(0, 240)}`)
  }
  if (answered.includes('1/2 已回答')) pass('ask row summary 走官方 ask.answered 计数')
  else fail(`ask row summary 缺计数：${answered.slice(0, 240)}`)
  if (answered.includes('未回答')) pass('ask row 未作答项回落 ask.skipped 文案')
  else fail('ask row 缺 skipped 文案')

  const waiting = collectText(askSeat.comp(askProps({ argsRaw: askArgs })), []).join('\n')
  if (waiting.includes('等待回答') && waiting.includes('要不要顺手推送？')) pass('ask row 等待态：等待回答 + 问题清单常驻')
  else fail(`ask row 等待态缺内容：${waiting.slice(0, 240)}`)

  const cancelled = collectText(askSeat.comp(askProps({
    kind: 'result',
    call: { argsRaw: askArgs },
    content: [],
    isError: true,
    error: { code: 'ASK_CANCELLED' },
  })), []).join('\n')
  if (cancelled.includes('已取消') && cancelled.includes('本轮已取消，未提交回答')) pass('ask row 取消态：verdict + 问题清单常驻')
  else fail(`ask row 取消态缺内容：${cancelled.slice(0, 240)}`)
}
const assistantSeat = cell('assistant-step')
if (assistantSeat === undefined) {
  fail('missing registration for key assistant-step')
} else if (assistantSeat.priority !== -100) {
  fail(`key assistant-step priority = ${assistantSeat.priority}, expected -100`)
} else if (assistantSeat.locale !== 'chat') {
  fail(`key assistant-step locale = ${assistantSeat.locale}, expected "chat"`)
} else {
  pass('seat conversation.chat.node / assistant-step @ priority -100')
}
const shot = registeredSlots.find((s) => s?.slot === 'conversation.chat.assistant-actions')
if (shot === undefined) {
  fail('missing screenshot action registration for conversation.chat.assistant-actions')
} else if (shot.id !== 'chat-flow-screenshot') {
  fail(`screenshot action id = ${JSON.stringify(shot.id)}, expected "chat-flow-screenshot"`)
} else if (shot.order !== 5) {
  fail(`screenshot action order = ${shot.order}, expected 5`)
} else {
  pass('seat conversation.chat.assistant-actions / chat-flow-screenshot @ order 5')
}

// 思考 chip / 工具 chip 共用的 window 级抽屉总线已创建（apply 内不会建，
// 但 mountActivityDrawer 只挂根；总线由首个 chip 挂载时惰性创建——此处
// 校验抽屉根存在即视为通道就绪）。
const bus = sandbox.__dshActivityDrawerStore__
console.log(`info  activity drawer bus present at apply time: ${bus !== undefined ? 'yes' : 'no (lazy, created on first chip mount)'}`)

console.log(`\n${process.exitCode ? 'SMOKE FAILED' : 'SMOKE PASSED'} — ${CLIENT}`)
process.exit(process.exitCode ?? 0)
