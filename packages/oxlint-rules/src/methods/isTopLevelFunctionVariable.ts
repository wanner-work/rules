import type AstNode from '../types/AstNode'

export default function isTopLevelFunctionVariable(node: AstNode): boolean {
  return (
    node.parent?.type === 'VariableDeclaration' &&
    node.parent.parent?.type === 'Program'
  )
}
