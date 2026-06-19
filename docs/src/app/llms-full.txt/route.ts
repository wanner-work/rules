import SOURCE from '@/constants/SOURCE'
import getLLMText from '@/methods/getLLMText'

export const revalidate = false

export async function GET() {
  const scan = SOURCE.loader.getPages().map(getLLMText)
  const scanned = await Promise.all(scan)

  return new Response(scanned.join('\n\n'))
}
