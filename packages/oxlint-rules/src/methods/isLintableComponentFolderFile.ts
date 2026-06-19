import type LintContext from '../types/LintContext'
import getFilePath from './getFilePath'
import isComponentFolderFile from './isComponentFolderFile'

export default function isLintableComponentFolderFile(
  context: LintContext
): boolean {
  const filePath = getFilePath(context)

  return Boolean(
    filePath && filePath !== '<input>' && isComponentFolderFile(filePath)
  )
}
