import Markdown from '@components/Common/Markdown'
import { createFileRoute } from '@tanstack/react-router'

import 'github-markdown-css/github-markdown.css' // GitHub-like typography
import README from './data/README.md?raw'

// interface IMarkdownProps {
//   source: string
// }

// export default function Markdown({ source }: IMarkdownProps): ReactElement {
//   const html = useMemo<string>(() => {
//     const md = new Marked({ gfm: true })
//     md.use(gfmHeadingId())
//     md.use(
//       markedHighlight({
//         langPrefix: 'hljs language-',
//         emptyLangClass: 'hljs',
//         highlight(code: string, lang: string): string {
//           const language = hljs.getLanguage(lang) ? lang : 'plaintext'
//           return hljs.highlight(code, { language }).value
//         },
//       })
//     )

//     const out = md.parse(source)
//     if (typeof out !== 'string') {
//       throw new Error(
//         'Marked returned a Promise: enable an async rendering path or disable async plugins.'
//       )
//     }
//     return DOMPurify.sanitize(out)
//   }, [source])

//   return (
//     <article
//       className='markdown-body p-4 rounded-xl'
//       dangerouslySetInnerHTML={{ __html: html }}
//     />
//   )
// }

export const Route = createFileRoute('/Readme/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className='p-4'>
      <h1 className='text-4xl'>Readme</h1>
      <section className='my-6'>
        <h3 className='mb-4 text-2xl'>Starter Template Repo ReadMe</h3>

        <Markdown source={README} />
      </section>
    </main>
  )
}
