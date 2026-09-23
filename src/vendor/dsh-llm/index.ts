/**
 * dsh-triad 用到的 `@deepseek-ai/dsh-llm` 叶子模块的本地入口。
 *
 * 为什么要内联而不是 `import ... from '@deepseek-ai/dsh-llm'`：
 * DSH 的 `@deepseek-ai/*` 包只发布源码，不发布运行时产物（`lib/` 里只有
 * `.d.ts`）。DSH 自己能在运行时解析它们，是因为它跑在 tsx 下、靠
 * `tsconfig.base.json` 的 `paths` 把包名映射回 `packages/**\/src`。
 * 而 tsx 只对 **不在 node_modules 里** 的 importer 应用 `paths`——
 * 插件一旦被 `dsh plugin add` 装进 profile 的 node_modules，这条映射就失效，
 * 只剩下 node 的裸解析，于是 `@deepseek-ai/dsh-llm` 落到
 * `lib/index.js`（不存在）→ `ERR_MODULE_NOT_FOUND`。
 *
 * 因此这里把用到的**叶子模块**（不依赖 cordis、不注册任何服务，纯函数/纯类）
 * 原样内联一份。它们运行时只依赖 `@deepseek-ai/dsh-util-crypto`，而那个包
 * 有真实产物（`lib/index.js` 且无外部导入），可以安全地留在 externals 里。
 *
 * 本文件与同目录其余文件均逐字复制自 DSH 源码，未作逻辑改动；
 * 仅把值导入（value import）的指向改为本地。
 *
 * @module vendor/dsh-llm
 */

export { BlockAssembler } from './assembler.ts'
export { MessageId, ToolCallId } from './brand.ts'
export { deepFreeze } from './call-config.ts'
export { HarnessError } from './error.ts'
export { assertNever } from './never.ts'
export { createAssistantMessage, createMessage, createUserMessage } from './message.ts'

export type { ContentBlock, FinishReason, Message, MessageSource, StreamChunk, TokenUsage } from './types.ts'
