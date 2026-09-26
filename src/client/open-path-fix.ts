/**
 * dsh-chat-plus — 「在文件管理器中打开」修复（client 半身）。
 *
 * 官方 open-in-app 前端统一用 `fetch` POST `/open-in-app/open`，body 是
 * `{ app, path }`。文件管理器那一类（Windows 的 `explorer`）在服务端被
 * `windowsHide: true` 吞掉窗口，点��像没反应——细节见
 * `../open-path/index.ts` 的头注释。
 *
 * 这里在 fetch 层面做**最小改道**：只认 `app === 'explorer'` 且带字符串
 * path 的那一种请求，改发本插件的 `/api/chat-flow/open-path`；其余请求
 * （VSCode、Chrome…以及任何解析不了的）一律原样放行，官方链路不受影响。
 * 改道失败（路由未就绪 / 非 2xx）也回落到官方请求，不把功能改坏。
 *
 * 为什么不按按钮打补丁：路径不在 DOM 上（按钮只有 `data-open-path-more`
 * 这类空标记，真实路径在 React props 里），DOM 拦截拿不到目标；fetch
 * 是唯一能同时拿到 app 与 path 的位置。
 */

/**
 * 官方打开路由的**匹配片段**。
 *
 * 刻意不带前导斜杠：官方前端发的是相对 URL（`open-in-app/open`），
 * 带斜杠去 includes 会永远落空 —— 补丁看起来装上了却一次都没生效。
 * 不带斜杠时，相对（`open-in-app/open`）与绝对（`/open-in-app/open`）
 * 两种写法都能命中。
 */
const UPSTREAM_ROUTE = 'open-in-app/open'
/** 本插件的修正版打开路由。 */
const FIXED_ROUTE = '/api/chat-flow/open-path'
/** 受影响的应用 id：仅 Windows 资源管理器。其它平台的 finder 走 macOS 的 open，不受影响。 */
const AFFECTED_APPS = new Set(['explorer'])

/** 打过的标记，避免重复包裹（HMR / 多次 apply）。 */
const INSTALL_FLAG = '__dshOpenPathFixInstalled'

/** 取请求的 URL 字符串（fetch 的 input 有三种形态）。 */
function urlOf(input: any): string {
  if (typeof input === 'string') return input
  if (input instanceof URL) return input.href
  return String(input?.url ?? '')
}

/** 取请求方法：显式 init 优先，否则取 Request 自带的方法。 */
function methodOf(input: any, init: any): string {
  const fromInit = init?.method
  if (typeof fromInit === 'string' && fromInit !== '') return fromInit.toUpperCase()
  const fromInput = input && typeof input === 'object' ? input.method : undefined
  return typeof fromInput === 'string' ? fromInput.toUpperCase() : 'GET'
}

/**
 * 包装 window.fetch：只改道「用文件资源管理器打开」，其余原样透传。
 * 幂等，重复调用只生效一次。
 */
export function installOpenPathFix(): void {
  const scope = window as any
  if (scope[INSTALL_FLAG]) return
  const original = window.fetch.bind(window)
  if (typeof original !== 'function') return
  scope[INSTALL_FLAG] = true

  window.fetch = async function patchedFetch(input: any, init?: any): Promise<Response> {
    try {
      const body = init?.body
      if (
        methodOf(input, init) === 'POST'
        && typeof body === 'string'
        && urlOf(input).includes(UPSTREAM_ROUTE)
      ) {
        const payload = JSON.parse(body)
        if (AFFECTED_APPS.has(payload?.app) && typeof payload?.path === 'string' && payload.path !== '') {
          const response = await original(FIXED_ROUTE, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ path: payload.path }),
            credentials: 'same-origin',
          })
          if (response.ok) return response
          // 修正路由没就绪等情况：落回官方链路，行为退化为升级前的样子。
        }
      }
    } catch {
      // 解析失败不是错误：交回原始请求。
    }
    return original(input, init)
  } as typeof window.fetch
}
