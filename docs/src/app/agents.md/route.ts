import AGENTS_MD from '@/constants/AGENTS_MD'

export const revalidate = false

export function GET() {
  return new Response(AGENTS_MD.content, {
    headers: {
      'Content-Type': 'text/markdown'
    }
  })
}
