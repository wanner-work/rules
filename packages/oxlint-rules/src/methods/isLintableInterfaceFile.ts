import type LintContext from '../types/LintContext'
import getFilePath from './getFilePath'
import isInterfaceFile from './isInterfaceFile'

export default function isLintableInterfaceFile(context: LintContext): boolean {
  const filePath = getFilePath(context)

  return Boolean(
    filePath && filePath !== '<input>' && isInterfaceFile(filePath)
  )
}
