export default interface RuleMeta {
  type: 'problem' | 'suggestion' | 'layout'
  docs: {
    description: string
  }
  schema: unknown[]
  messages: Record<string, string>
}
