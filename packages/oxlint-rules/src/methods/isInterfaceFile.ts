import FILE_PATTERNS from '../constants/FILE_PATTERNS'
import { ensureLeadingSlash } from './toPosixPath'
import toPosixPath from './toPosixPath'
import isInFolder from './isInFolder'

export default function isInterfaceFile(filePath: string): boolean {
  const normalizedPath = toPosixPath(filePath)
  const rootedPath = ensureLeadingSlash(normalizedPath)

  return (
    FILE_PATTERNS.INTERFACE.test(rootedPath) &&
    (isInFolder(filePath, 'interfaces') || isInFolder(filePath, 'types'))
  )
}