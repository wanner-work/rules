import type AstNode from '../types/AstNode'

export default function getTypeReferenceIdentifierName(
  typeNode: AstNode | null
): string | null {
  if (
    typeNode?.type === 'TSTypeReference' &&
    typeNode.typeName?.type === 'Identifier'
  ) {
    return typeNode.typeName.name
  }

  return null
}
