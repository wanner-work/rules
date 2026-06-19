import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation'
import { NextRequest, NextResponse } from 'next/server'
import docsContentRoute from '@/constants/DOCS_CONTENT_ROUTE'
import docsRoute from '@/constants/DOCS_ROUTE'

// oxlint-disable-next-line typescript/unbound-method
const { rewrite: rewriteDocs } = rewritePath(
  `${docsRoute.path}{/*path}`,
  `${docsContentRoute.path}{/*path}/content.md`
)
// oxlint-disable-next-line typescript/unbound-method
const { rewrite: rewriteSuffix } = rewritePath(
  `${docsRoute.path}{/*path}.md`,
  `${docsContentRoute.path}{/*path}/content.md`
)

export default function proxy(request: NextRequest) {
  const result = rewriteSuffix(request.nextUrl.pathname)
  if (result) {
    return NextResponse.rewrite(new URL(result, request.nextUrl))
  }

  if (isMarkdownPreferred(request)) {
    const result = rewriteDocs(request.nextUrl.pathname)

    if (result) {
      return NextResponse.rewrite(new URL(result, request.nextUrl))
    }
  }

  return NextResponse.next()
}
