import { llms } from 'fumadocs-core/source'
import SOURCE from '@/constants/SOURCE'

export const revalidate = false

export function GET() {
  return new Response(llms(SOURCE.loader).index())
}
