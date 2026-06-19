import FILE_PATTERNS from '../constants/FILE_PATTERNS'
import FOLDERS from '../constants/FOLDERS'
import { ensureLeadingSlash } from './toPosixPath'
import toPosixPath from './toPosixPath'

export default function isInterfaceFile(filePath: string): boolean {
  const normalizedPath = toPosixPath(filePath)
  const rootedPath = ensureLeadingSlash(normalizedPath)

  return (
    FILE_PATTERNS.INTERFACE.test(rootedPath) &&
    (rootedPath.includes(FOLDERS.INTERFACES) ||
      rootedPath.includes(FOLDERS.TYPES))
  )
}
