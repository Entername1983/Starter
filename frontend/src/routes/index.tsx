import { PageWrapper } from '@components/PageWrapper'
import { createFileRoute } from '@tanstack/react-router'

import { HomeContent } from './-components/HomeContent'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <PageWrapper>
      <HomeContent />
    </PageWrapper>
  )
}
