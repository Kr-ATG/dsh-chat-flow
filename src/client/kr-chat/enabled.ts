/**
 * dsh-chat-flow — KR 对话功能总开关。
 *
 * 控制「KR对话」这个视图分类 + 右侧 Agent 实时轨迹大盘（KrAgentPanel）。
 *
 * ⚠ 这是**隐藏开关，不是删除**：kr-chat/ 下的全部代码、样式、座位装配都原样
 * 保留，把这里改回 true 重新 build 即可完整恢复 KR 双栏形态（含「KR对话」标签、
 * 右侧大盘、收起胶囊、KR 专属 CSS 与截图按钮的 KR 门控）。
 *
 * false 时的行为 = 回到 KR 之前的形态：
 *  1. 不注入「KR对话」标签、不挂右侧大盘、不注入 KR 专属样式（见 index.ts）；
 *  2. store 初始 activeTab 直接是 'chat'，于是 isKrMode 全链路为 false：
 *     - 不再往 body 写 data-dsh-kr-chat → 「KR 模式下隐藏左侧工具树 / 折叠条」
 *       那套 CSS 不生效。这点很关键：那套规则是「详情收敛到右侧大盘」的前提，
 *       没有大盘还隐藏工具行，工具调用就彻底看不见了；
 *     - ThinkingStepNodeView 不再委托官方渲染，回到插件自带的思考 chip /
 *       步骤卡 / proto-tabs / diagram 呈现（见 pluginRenders）。
 *  3. 截图按钮回到「对话」里常驻（不再要求 KR 模式）。
 */
export const KR_CHAT_ENABLED = false
