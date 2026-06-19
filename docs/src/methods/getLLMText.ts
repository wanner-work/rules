import SOURCE from '@/constants/SOURCE'

export default async function getLLMText(
  page: (typeof SOURCE.loader)['$inferPage']
): Promise<string> {
  const processed = await page.data.getText('processed')

  return `# ${page.data.title} (${page.url})

${processed}`
}
