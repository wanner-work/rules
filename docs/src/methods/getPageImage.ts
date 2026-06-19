import DOCS_IMAGE_ROUTE from '@/constants/DOCS_IMAGE_ROUTE'
import SOURCE from '@/constants/SOURCE'

export default function getPageImage(
  page: (typeof SOURCE.loader)['$inferPage']
): {
  segments: string[]
  url: string
} {
  const segments = [...page.slugs, 'image.png']

  return {
    segments,
    url: `${DOCS_IMAGE_ROUTE.path}/${segments.join('/')}`
  }
}
