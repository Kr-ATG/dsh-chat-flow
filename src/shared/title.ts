/**
 * 对话标题提取工具（host / client 共享纯函数）。
 *
 * 从消息正文（提问或回复）中提取首个有意义内容行：
 * 剥离 Markdown 标题符（#）、引用（>）、列表项（-/*）、行内格式（*_~`）与代码围栏，
 * 截断到 64 字符；全空时按角色回退默认占位文案。
 */
export function deriveTitle(text: string, role: 'user' | 'assistant'): string {
  const lines = text.replace(/\r\n/g, '\n').split('\n')
  let inFence = false
  for (const line of lines) {
    const trimmed = line.trim()
    if (inFence) {
      if (trimmed.startsWith('```')) inFence = false
      continue
    }
    if (trimmed.startsWith('```')) { inFence = true; continue }
    if (trimmed === '') continue
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) continue
    if (trimmed.startsWith('|')) continue
    const cleaned = trimmed
      .replace(/^#{1,6}\s+/, '')
      .replace(/^>\s*/, '')
      .replace(/^[-*+]\s+/, '')
      .replace(/^\d+[.)]\s+/, '')
      .replace(/^\[[ xX]\]\s+/, '')
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/[*_~`]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
    if (cleaned !== '') {
      const limit = 64
      return cleaned.length > limit ? `${cleaned.slice(0, limit)}…` : cleaned
    }
  }
  return role === 'user' ? '我的提问' : 'AI 回复'
}
