import DOMPurify from 'dompurify'
import hljs from 'highlight.js/lib/core'
import bash from 'highlight.js/lib/languages/bash'
import css from 'highlight.js/lib/languages/css'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import plaintext from 'highlight.js/lib/languages/plaintext'
import python from 'highlight.js/lib/languages/python'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import { Marked } from 'marked'
import { gfmHeadingId } from 'marked-gfm-heading-id'
import { markedHighlight } from 'marked-highlight'
import { useMemo, type ReactElement } from 'react'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('ts', typescript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('py', python)
hljs.registerLanguage('json', json)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('css', css)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('sh', bash)
hljs.registerLanguage('plaintext', plaintext)

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
