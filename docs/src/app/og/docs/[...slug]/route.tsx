import { generate as DefaultImage } from 'fumadocs-ui/og'
import { notFound } from 'next/navigation'
import { ImageResponse } from 'next/og'
import appName from '@/constants/APP_NAME'
import SOURCE from '@/constants/SOURCE'
import getPageImage from '@/methods/getPageImage'

export const revalidate = false

export async function GET(
  _req: Request,
  { params }: RouteContext<'/og/docs/[...slug]'>
) {
  const { slug } = await params
  const page = SOURCE.loader.getPage(slug.slice(0, -1))
  if (!page) notFound()

  return new ImageResponse(
    <DefaultImage
      title={page.data.title}
      description={page.data.description}
      site={appName.value}
    />,
    {
      width: 1200,
      height: 630
    }
  )
}

export function generateStaticParams() {
  return SOURCE.loader.getPages().map((page) => ({
    lang: page.locale,
    slug: getPageImage(page).segments
  }))
}
