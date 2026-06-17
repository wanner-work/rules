import type LintContext from '../types/LintContext'

export default function getFilePath(context: LintContext): string | null {
  if (context.filename) {
    return context.filename
  }

  if (typeof context.getFilename === 'function') {
    return context.getFilename()
  }

  return null
}
