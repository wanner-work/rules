import type AstNode from '../types/AstNode'

export default function getParameterTypeAnnotation(
  parameter: AstNode | null | undefined
): AstNode | null {
  if (!parameter) {
    return null
  }

  if (parameter.type === 'AssignmentPattern') {
    return getParameterTypeAnnotation(parameter.left)
  }

  if (parameter.type === 'RestElement') {
    return getParameterTypeAnnotation(parameter.argument)
  }

  if (!parameter.typeAnnotation?.typeAnnotation) {
    return null
  }

  return parameter.typeAnnotation.typeAnnotation
}
