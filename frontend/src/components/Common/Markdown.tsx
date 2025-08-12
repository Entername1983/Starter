import DOMPurify from 'dompurify'
import hljs from 'highlight.js'
import { Marked } from 'marked'
import { gfmHeadingId } from 'marked-gfm-heading-id'
import { markedHighlight } from 'marked-highlight'
import { useMemo, type ReactElement } from 'react'

interface MarkdownProps {
  source: string
}

export default function Markdown({ source }: MarkdownProps): ReactElement {
  const html = useMemo<string>(() => {
    const md = new Marked({ gfm: true })
    md.use(gfmHeadingId())
    md.use(
      markedHighlight({
        langPrefix: 'hljs language-',
        emptyLangClass: 'hljs',
        highlight(code: string, lang: string): string {
          const language = hljs.getLanguage(lang) ? lang : 'plaintext'
          return hljs.highlight(code, { language }).value
        },
      })
    )

    const out = md.parse(source)
    if (typeof out !== 'string') {
      throw new Error(
        'Marked returned a Promise: enable an async rendering path or disable async plugins.'
      )
    }

    return DOMPurify.sanitize(out)
  }, [source])

  return (
    <article
      className='markdown-body p-4 rounded-xl'
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
