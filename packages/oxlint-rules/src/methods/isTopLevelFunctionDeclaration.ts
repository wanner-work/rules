import type AstNode from '../types/AstNode'

export default function isTopLevelFunctionDeclaration(node: AstNode): boolean {
  return node.parent?.type === 'Program'
}
