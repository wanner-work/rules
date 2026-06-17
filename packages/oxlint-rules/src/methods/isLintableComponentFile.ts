import type LintContext from '../types/LintContext'
import getFilePath from './getFilePath'
import isComponentFile from './isComponentFile'

export default function isLintableComponentFile(context: LintContext): boolean {
  const filePath = getFilePath(context)

  return Boolean(
    filePath && filePath !== '<input>' && isComponentFile(filePath)
  )
}
