import type LintContext from './LintContext'
import type RuleListener from './RuleListener'
import type RuleMeta from './RuleMeta'

export default interface RuleModule {
  meta: RuleMeta
  create: (context: LintContext) => RuleListener
}
