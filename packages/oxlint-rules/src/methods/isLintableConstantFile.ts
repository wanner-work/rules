import type LintContext from '../types/LintContext'
import getFilePath from './getFilePath'
import isConstantFile from './isConstantFile'

export default function isLintableConstantFile(context: LintContext): boolean {
  const filePath = getFilePath(context)

  return Boolean(filePath && filePath !== '<input>' && isConstantFile(filePath))
}
