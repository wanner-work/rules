import type LintContext from '../types/LintContext'
import getFilePath from './getFilePath'
import isHookFile from './isHookFile'

export default function isLintableHookFile(context: LintContext): boolean {
  const filePath = getFilePath(context)

  return Boolean(filePath && filePath !== '<input>' && isHookFile(filePath))
}
