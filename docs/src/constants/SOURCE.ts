import { docs } from 'collections/server'
import { loader } from 'fumadocs-core/source'
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons'
import DOCS_ROUTE from '@/constants/DOCS_ROUTE'

// See https://fumadocs.dev/docs/headless/source-api for more info
const SOURCE = {
  loader: loader({
    baseUrl: DOCS_ROUTE.path,
    source: docs.toFumadocsSource(),
    plugins: [lucideIconsPlugin()]
  })
}

export default SOURCE
