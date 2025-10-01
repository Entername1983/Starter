import { PageWrapper } from '@components/PageWrapper'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/License/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageWrapper>
      {' '}
      <header>
        <h1 className='text-4xl'>MIT License with Attribution</h1>
      </header>
      <section>
        <p>
          <strong>Copyright (c) 2025 Entername1983</strong>
        </p>
        <ul>
          <li>
            Permission is hereby granted, free of charge, to any person
            obtaining a copy of this software and associated documentation files
            (the &quot;Software&quot;), to deal in the Software without
            restriction, including without limitation the rights to use, copy,
            modify, merge, publish, distribute, sublicense, and/or sell copies
            of the Software, and to permit persons to whom the Software is
            furnished to do so, subject to the following conditions:
          </li>

          <li>
            The above copyright notice and this permission notice shall be
            included in all copies or substantial portions of the Software.
          </li>

          <li>
            <aside>
              <p>
                <strong>Attribution Requirement:</strong> You must give
                appropriate credit, provide a link to the original repository,
                and indicate if changes were made. You may do so in any
                reasonable manner, but not in any way that suggests the licensor
                endorses you or your use.
              </p>
            </aside>
          </li>
          <li>
            THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY
            KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
            WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
            NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
            BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
            ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
            CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
            SOFTWARE.
          </li>
        </ul>
      </section>
    </PageWrapper>
  )
}
