import { createFromSource } from 'fumadocs-core/search/server'
import SOURCE from '@/constants/SOURCE'

export const { GET } = createFromSource(SOURCE.loader, {
  // https://docs.orama.com/docs/orama-js/supported-languages
  language: 'english'
})
