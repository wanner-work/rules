import type AstNode from '../types/AstNode'

export default function getFunctionNodeFromVariableDeclarator(
  node: AstNode
): AstNode | null {
  if (
    node.id.type === 'Identifier' &&
    node.init &&
    (node.init.type === 'ArrowFunctionExpression' ||
      node.init.type === 'FunctionExpression')
  ) {
    return node.init
  }

  return null
}
