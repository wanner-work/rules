import FILE_PATTERNS from '../constants/FILE_PATTERNS'
import FOLDERS from '../constants/FOLDERS'
import { ensureLeadingSlash } from './toPosixPath'
import toPosixPath from './toPosixPath'

export default function isConstantFile(filePath: string): boolean {
  const normalizedPath = toPosixPath(filePath)
  const rootedPath = ensureLeadingSlash(normalizedPath)

  return (
    FILE_PATTERNS.CONSTANT.test(rootedPath) &&
    rootedPath.includes(`/src${FOLDERS.CONSTANTS}`)
  )
}
