/**
 * Lightweight markdown renderer for the memory panel.
 *
 * The upstream memory panel rendered entry content through webui's full
 * streaming markdown renderer, which drags in shiki + mermaid + katex +
 * markstream (several MB) for one static call site. Memory entries are short
 * plain-text notes, so this module covers the subset that actually shows up:
 *
 *   fenced code · ATX headings · bullet/ordered lists · blockquotes · rules
 *   inline: `code` **bold** *italic* ~~strike~~ [text](url)
 *
 * Output is built from React elements only — no dangerouslySetInnerHTML, so
 * entry content can never inject markup.
 */

import { memo, type ReactNode } from 'react'

/** Props mirror the upstream component so the call site stays unchanged. */
interface MarkstreamMarkdownProps {
  text: string
  streaming: boolean
  /** Accepted for signature compatibility; memory content carries no mentions. */
  fileMentions?: unknown
}

/** Wrap a run of inline text into React nodes. */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = []
  // One pass over the inline grammar; `code` wins over emphasis so backticks
  // inside prose stay literal.
  const pattern = /(`[^`]+`)|(\*\*[^*]+\*\*)|(__[^_]+__)|(~~[^~]+~~)|(\*[^*\n]+\*)|(_[^_\n]+_)|(\[[^\]]*\]\([^)\s]+\))/g
  let cursor = 0
  let match: RegExpExecArray | null
  let index = 0

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > cursor) nodes.push(text.slice(cursor, match.index))
    const token = match[0]
    const key = `${keyPrefix}-i${index}`
    index += 1

    if (token.startsWith('`')) {
      nodes.push(<code key={key} className="dsh-triad-md__code">{token.slice(1, -1)}</code>)
    } else if (token.startsWith('**') || token.startsWith('__')) {
      nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>)
    } else if (token.startsWith('~~')) {
      nodes.push(<del key={key}>{token.slice(2, -2)}</del>)
    } else if (token.startsWith('[')) {
      const split = token.indexOf('](')
      const label = token.slice(1, split)
      const href = token.slice(split + 2, -1)
      nodes.push(
        <a key={key} href={href} target="_blank" rel="noreferrer noopener" className="dsh-triad-md__link">
          {label}
        </a>,
      )
    } else {
      nodes.push(<em key={key}>{token.slice(1, -1)}</em>)
    }
    cursor = match.index + token.length
  }

  if (cursor < text.length) nodes.push(text.slice(cursor))
  return nodes
}

/** Render one fenced code block. */
function renderFence(lines: string[], key: string): ReactNode {
  return (
    <pre key={key} className="dsh-triad-md__pre">
      <code>{lines.join('\n')}</code>
    </pre>
  )
}

/** Render one bullet or ordered list from its consecutive lines. */
function renderList(lines: string[], ordered: boolean, key: string): ReactNode {
  const items = lines.map((line, itemIndex) => {
    const body = ordered ? line.replace(/^\s*\d+[.)]\s+/, '') : line.replace(/^\s*[-*+]\s+/, '')
    return (
      <li key={`${key}-l${itemIndex}`}>
        {renderInline(body, `${key}-l${itemIndex}`)}
      </li>
    )
  })
  return ordered
    ? <ol key={key} className="dsh-triad-md__list">{items}</ol>
    : <ul key={key} className="dsh-triad-md__list">{items}</ul>
}

/** Convert a markdown document into React nodes. */
function parse(text: string): ReactNode[] {
  const lines = text.replace(/\r\n/g, '\n').split('\n')
  const out: ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i] ?? ''

    // Fenced code block — consume until the closing fence.
    if (/^\s*```/.test(line)) {
      const start = i + 1
      let end = start
      while (end < lines.length && !/^\s*```/.test(lines[end] ?? '')) end += 1
      out.push(renderFence(lines.slice(start, end), `b${i}`))
      i = end + 1
      continue
    }

    // Blank line.
    if (line.trim() === '') { i += 1; continue }

    // Horizontal rule.
    if (/^\s*([-*_])\1{2,}\s*$/.test(line)) {
      out.push(<hr key={`b${i}`} className="dsh-triad-md__hr" />)
      i += 1
      continue
    }

    // ATX heading.
    const heading = /^(#{1,6})\s+(.*)$/.exec(line)
    if (heading !== null) {
      // Cap at h6 and offset by two so an entry's `#` never outranks the panel chrome.
      const level = Math.min(6, (heading[1]?.length ?? 1) + 2)
      const body = renderInline(heading[2] ?? '', `b${i}`)
      const Tag = `h${level}` as 'h3' | 'h4' | 'h5' | 'h6'
      out.push(<Tag key={`b${i}`} className="dsh-triad-md__h">{body}</Tag>)
      i += 1
      continue
    }

    // Blockquote — strip the marker and render as one paragraph run.
    if (/^\s*>/.test(line)) {
      const start = i
      while (i < lines.length && /^\s*>/.test(lines[i] ?? '')) i += 1
      const body = lines.slice(start, i).map(l => (l ?? '').replace(/^\s*>\s?/, '')).join(' ')
      out.push(
        <blockquote key={`b${start}`} className="dsh-triad-md__quote">
          {renderInline(body, `b${start}`)}
        </blockquote>,
      )
      continue
    }

    // Lists — gather the consecutive run so it becomes one <ul>/<ol>.
    const isBullet = (l: string): boolean => /^\s*[-*+]\s+/.test(l)
    const isOrdered = (l: string): boolean => /^\s*\d+[.)]\s+/.test(l)
    if (isBullet(line) || isOrdered(line)) {
      const ordered = isOrdered(line)
      const start = i
      while (i < lines.length && (ordered ? isOrdered(lines[i] ?? '') : isBullet(lines[i] ?? ''))) i += 1
      out.push(renderList(lines.slice(start, i), ordered, `b${start}`))
      continue
    }

    // Paragraph — gather until a blank line or the start of another block.
    const start = i
    while (
      i < lines.length
      && (lines[i] ?? '').trim() !== ''
      && !/^\s*```/.test(lines[i] ?? '')
      && !/^(#{1,6})\s+/.test(lines[i] ?? '')
      && !/^\s*>/.test(lines[i] ?? '')
      && !isBullet(lines[i] ?? '')
      && !isOrdered(lines[i] ?? '')
    ) i += 1
    out.push(
      <p key={`b${start}`} className="dsh-triad-md__p">
        {renderInline(lines.slice(start, i).join(' '), `b${start}`)}
      </p>,
    )
  }

  return out
}

/** Markdown renderer used by the memory detail pane. */
export const MarkstreamMarkdown = memo(function MarkstreamMarkdown({ text }: MarkstreamMarkdownProps) {
  return <div className="dsh-triad-md">{parse(text ?? '')}</div>
})
