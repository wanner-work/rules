import type AstNode from '../types/AstNode'

export default function unwrapTypeWrapper(
  typeNode: AstNode | null
): AstNode | null {
  const typeParams =
    typeNode?.typeParameters?.params ?? typeNode?.typeArguments?.params ?? []

  if (
    typeNode?.type === 'TSTypeReference' &&
    typeNode.typeName?.type === 'Identifier' &&
    typeParams.length === 1
  ) {
    const wrapperName = typeNode.typeName.name

    if (
      wrapperName === 'Readonly' ||
      wrapperName === 'Partial' ||
      wrapperName === 'Required'
    ) {
      return unwrapTypeWrapper(typeParams[0])
    }
  }

  return typeNode
}
