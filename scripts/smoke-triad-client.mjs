/**
 * dsh-triad — browser half smoke test.
 *
 * Executes `lib/client.js` under a stubbed DSH client environment and asserts:
 *   1. it registers exactly one `__ModuleLoader__` entry with the right id
 *   2. the factory exports `apply` (function) and `inject` (array)
 *   3. `apply(ctx)` runs all three modules without throwing
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

/**
 * Minimal DOM node. The nav-row mounting code walks the real sidebar with
 * `compareDocumentPosition`, so the stub has to answer it or the memory
 * module bails out before reaching the interesting code paths.
 */
function stubNode(tag = 'div') {
  const node = {
    tagName: String(tag).toUpperCase(),
    children: [],
    style: {},
    dataset: {},
    classList: { add: () => {}, remove: () => {}, toggle: () => {}, contains: () => false },
    attrs: {},
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
  }
  return node
}

/** Explicit React overrides. Kept separate so the Proxy below can consult it
 *  first — a bare `get` trap would otherwise shadow every one of these. */
const REACT_OVERRIDES = {
      createElement: (type, props, ...children) => ({ type, props, children }),
      cloneElement: (el) => el,
      isValidElement: () => false,
      Children: { map: () => [], forEach: () => {}, count: () => 0, toArray: () => [] },
      Fragment: Symbol('Fragment'),
      // Real class, not a stub function: `class X extends Component` is a
      // module-top-level evaluation (error boundaries), and extending the
      // generic stub function throws "is not a constructor".
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
    // Known export → the real override; anything else (icon sets, future
    // hooks) falls back to a stub component.
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
  '@deepseek-ai/dsh-client-ui-primitives': new Proxy({}, {
    get: (_t, prop) => (typeof prop === 'string' ? stubComponent(prop) : undefined),
    has: () => true,
  }),
}

// ── capture the loader registration ──────────────────────────────────────
const registrations = []
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
  // Timers are recorded but never scheduled: the nav-mount poller would
  // otherwise keep the event loop alive and hang the smoke run.
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
  CSS: { supports: () => false },
}
// Browsers alias `window` to the global object; the bundle uses `window.setInterval`.
sandbox.window = sandbox
sandbox.globalThis = sandbox
sandbox.self = sandbox
sandbox.top = sandbox
sandbox.parent = sandbox
sandbox.location = { href: 'http://127.0.0.1:0/', origin: 'http://127.0.0.1:0', protocol: 'http:', host: '127.0.0.1:0' }
sandbox.navigator = { userAgent: 'dsh-triad-smoke', language: 'zh-CN', maxTouchPoints: 0 }
sandbox.innerWidth = 1440
sandbox.innerHeight = 900
sandbox.devicePixelRatio = 1
sandbox.addEventListener = () => {}
sandbox.removeEventListener = () => {}
sandbox.dispatchEvent = () => true
sandbox.getComputedStyle = () => ({ getPropertyValue: () => '' })
sandbox.scrollTo = () => {}

const context = vm.createContext(sandbox)
const code = readFileSync(CLIENT, 'utf8')
new vm.Script(code, { filename: CLIENT }).runInContext(context)

// ── assertions ───────────────────────────────────────────────────────────
const fail = (msg) => { console.error(`FAIL  ${msg}`); process.exitCode = 1 }
const pass = (msg) => console.log(`ok    ${msg}`)

if (registrations.length !== 1) fail(`expected 1 loader registration, got ${registrations.length}`)
else pass('registered exactly one __ModuleLoader__ entry')

// 融合后 client bundle 的 loader id 是主插件 id（dsh-chat-plus）；这里的断言面
// 从「triad 单独一枚」改成「融合后同一枚 factory 里 triad 半身仍可用」。
const entry = registrations[0]
if (entry?.id !== 'dsh-chat-plus') fail(`expected id "dsh-chat-plus", got ${JSON.stringify(entry?.id)}`)
else pass('loader id is "dsh-chat-plus" (fused bundle)')

const require = (id) => {
  if (id in MODULES) return MODULES[id]
  throw new Error(`[smoke] unexpected require(${id}) — add it to the stub table`)
}

const mod = entry.factory(require)
if (typeof mod.apply !== 'function') fail('factory did not export apply()')
else pass('factory exports apply()')
if (!Array.isArray(mod.inject)) fail('factory did not export inject[]')
else pass(`factory exports inject[] = [${mod.inject.join(', ')}]`)

// ── run apply() against a stub client context ────────────────────────────
// 融合后的 apply 同时装配对话增强 + 四工作台，所以桩要给全 chat-plus 也要用的
// slots.entries（captureOfficialAssistantStep 要读官方 assistant-step 条目）。
const registered = []
const slotsStub = {
  register: (_spec, comp) => { if (comp === undefined) throw new Error('slots.register called without component'); return () => {} },
  inject: (_slot, factory) => { factory?.(); return () => {} },
  entries: (name) => (name === 'conversation.chat.node' ? [{ key: 'assistant-step', options: { inject: [] } }] : []),
}
const ctx = {
  effect: (fn) => { registered.push(typeof fn === 'function' ? fn() : undefined); return () => {} },
  locale: { register: () => () => {} },
  slots: slotsStub,
  get: (name) => (name === 'sessions' ? { list: { getSnapshot: () => ({ byId: {} }) } } : undefined),
  inject: (names, fn) => {
    if (!Array.isArray(names)) throw new Error('ctx.inject expects a names array')
    const scope = { slots: slotsStub, locale: ctx.locale }
    for (const n of names) {
      if (n === 'sessions') scope.sessions = ctx.get('sessions')
      else if (n === 'inputTriggers') scope.inputTriggers = { register: () => () => {} }
      else scope[n] = undefined
    }
    fn?.(scope)
  },
}

try {
  mod.apply(ctx)
  pass('apply(ctx) ran all modules (chat-plus + four workbenches) without throwing')
} catch (error) {
  fail(`apply(ctx) threw: ${error?.stack ?? error}`)
}

// ── Token 活动：52 周贡献热力模型（纯函数断言） ─────────────────────────
const { buildActivityGrid, activityColor, ACTIVITY_COLUMNS: ACTIVITY_COLS } = mod
if (typeof buildActivityGrid !== 'function' || typeof activityColor !== 'function') {
  fail('buildActivityGrid / activityColor must be exported from the client bundle')
} else if (ACTIVITY_COLS !== 52) {
  fail(`Token 活动 must span 52 week columns, got ${ACTIVITY_COLS}`)
} else {
  pass('Token 活动 exports 52-week grid model')
}

const weekKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const weekdayIdx = (key) => { const [y, m, d] = key.split('-').map(Number); return (new Date(y, m - 1, d).getDay() + 6) % 7 }
const fixedToday = new Date(2026, 7, 23) // 2026-08-23（周日）
const synthDays = []
for (let i = 0; i < 60; i += 1) {
  const d = new Date(2026, 7, 23 - i)
  const wd = (d.getDay() + 6) % 7
  const weekend = wd === 0 || wd === 6
  synthDays.push({ date: weekKey(d), tokens: weekend ? 4000 : 90000 + (i % 9) * 55000, requests: 3 + (i % 5), cacheHitRate: i % 4 === 0 ? 0 : 87.3 })
}

if (typeof buildActivityGrid === 'function') {
  const snap = buildActivityGrid(synthDays, 'day', fixedToday)
  if (snap.columns !== 52 || snap.cells.length !== 52 * 7) fail(`grid shape must be 52 x 7, got ${snap.cells.length} cells`)
  else if (snap.rows.length !== 7 || snap.rows.some((row) => row.length !== 52)) fail('rows must be 7 rows of 52')
  else pass('grid shape is 52 weeks x 7 weekday rows')

  const todayCell = snap.cells.find((c) => c.key === '2026-08-23')
  if (todayCell === undefined || todayCell.isToday !== true || todayCell.column !== 51) fail('today must sit in the last column')
  else pass('grid right-aligns on the current week')

  const futureCount = snap.cells.filter((c) => !c.past).length
  if (futureCount !== 6 - weekdayIdx('2026-08-23')) fail(`only the current week holds future placeholders, got ${futureCount}`)
  else pass('future days are in-week placeholders only')

  const byDate = new Map(synthDays.map((d) => [d.date, d.tokens]))
  const dayOk = snap.cells.every((c) => c.tokens === (byDate.get(c.key) ?? 0))
  if (!dayOk) fail('day mode must carry each day own tokens')
  else pass('day mode carries per-day tokens')

  const weekSnap = buildActivityGrid(synthDays, 'week', fixedToday)
  let weekOk = true
  for (let c = 0; c < 52; c += 1) {
    if (new Set(weekSnap.rows.map((row) => row[c].tokens)).size !== 1) { weekOk = false; break }
  }
  if (!weekOk) fail('week mode must share one Monday-start total per column')
  else pass('week mode shares one total per column')

  const cumSnap = buildActivityGrid(synthDays, 'cumulative', fixedToday)
  let prev = -1
  let cumOk = true
  for (const cell of cumSnap.cells) {
    if (cell.tokens < prev) { cumOk = false; break }
    prev = cell.tokens
  }
  if (!cumOk) fail('cumulative must never decrease')
  else pass('cumulative mode is monotonic')

  const expectedTotal = synthDays.reduce((sum, d) => sum + d.tokens, 0)
  if (cumSnap.cells[cumSnap.cells.length - 1].tokens !== expectedTotal) fail('cumulative tail must equal the token total')
  else pass('cumulative tail equals total tokens')

  const expectedPeak = Math.max(...synthDays.map((d) => d.tokens))
  if (snap.peakDay === null || snap.peakTokens !== expectedPeak) fail(`peak day must be the busiest day, expected ${expectedPeak}`)
  else pass('peak-day detection ok')

  if (snap.activeDays !== synthDays.filter((d) => d.tokens > 0).length) fail('activeDays must count non-zero days')
  else pass('active-day count ok')
}

if (typeof activityColor === 'function') {
  const alphaOf = (t, m) => Number(activityColor(t, m).match(/rgba\(\d+, \d+, \d+, ([\d.]+)\)/)?.[1] ?? -1)
  if (!activityColor(0, 100).includes('color-mix')) fail('zero must render the neutral gray fill')
  else if (alphaOf(1e9, 1e9) !== 1) fail('the busiest cell must reach alpha 1')
  else {
    const ramp = [1, 1000, 100000, 10000000].map((t) => alphaOf(t, 10000000))
    if (ramp.some((a, i) => i > 0 && a <= ramp[i - 1])) fail(`color ramp must be monotonic: ${ramp.join(',')}`)
    else if (ramp[0] !== 0.25) fail(`the quietest cell must start at alpha 0.25, got ${ramp[0]}`)
    else pass(`activity color ramp ok: ${ramp.map((a) => a.toFixed(3)).join(' -> ')}`)
  }
}

console.log(`\n${process.exitCode ? 'SMOKE FAILED' : 'SMOKE PASSED'} — ${CLIENT}`)
// Explicit exit: stubbed modules may hold listeners/timers that keep node alive.
process.exit(process.exitCode ?? 0)
