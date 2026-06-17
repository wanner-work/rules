import type LintContext from '../types/LintContext'
import getFilePath from './getFilePath'
import isMethodFile from './isMethodFile'

export default function isLintableMethodFile(context: LintContext): boolean {
  const filePath = getFilePath(context)

  return Boolean(filePath && filePath !== '<input>' && isMethodFile(filePath))
}
