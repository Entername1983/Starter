import Markdown from '@components/Common/Markdown'
import { PageWrapper } from '@components/PageWrapper'
import { createFileRoute } from '@tanstack/react-router'

import 'github-markdown-css/github-markdown.css' // GitHub-like typography
import README from './data/README.md?raw'

export const Route = createFileRoute('/Readme/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageWrapper>
      {' '}
      <h1 className='text-4xl'>Readme</h1>
      <section className='my-6'>
        <h3 className='mb-4 text-2xl'>Starter Template Repo ReadMe</h3>

        <Markdown source={README} />
      </section>
    </PageWrapper>
  )
}
