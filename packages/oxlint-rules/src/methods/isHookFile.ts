import FILE_PATTERNS from '../constants/FILE_PATTERNS'
import { ensureLeadingSlash } from './toPosixPath'
import toPosixPath from './toPosixPath'
import isInFolder from './isInFolder'

export default function isHookFile(filePath: string): boolean {
  const normalizedPath = toPosixPath(filePath)
  const rootedPath = ensureLeadingSlash(normalizedPath)

  return (
    FILE_PATTERNS.HOOK.test(rootedPath) && isInFolder(filePath, 'hooks')
  )
}