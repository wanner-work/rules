import type AstNode from './AstNode'

export default interface RuleListener {
  [key: string]: (node: AstNode) => void
}
