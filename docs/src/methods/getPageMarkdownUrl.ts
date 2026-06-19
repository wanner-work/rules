import DOCS_CONTENT_ROUTE from '@/constants/DOCS_CONTENT_ROUTE'
import SOURCE from '@/constants/SOURCE'

export default function getPageMarkdownUrl(
  page: (typeof SOURCE.loader)['$inferPage']
): {
  segments: string[]
  url: string
} {
  const segments = [...page.slugs, 'content.md']

  return {
    segments,
    url: `${DOCS_CONTENT_ROUTE.path}/${segments.join('/')}`
  }
}
