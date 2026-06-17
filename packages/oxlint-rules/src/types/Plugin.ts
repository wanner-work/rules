import type RuleModule from './RuleModule'

export default interface Plugin {
  meta: {
    name: string
  }
  rules: Record<string, RuleModule>
}
