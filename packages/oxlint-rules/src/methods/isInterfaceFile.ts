import FILE_PATTERNS from '../constants/FILE_PATTERNS'
import FOLDERS from '../constants/FOLDERS'
import toPosixPath from './toPosixPath'

export default function isInterfaceFile(filePath: string): boolean {
  const normalizedPath = toPosixPath(filePath)

  return (
    FILE_PATTERNS.INTERFACE.test(normalizedPath) &&
    (normalizedPath.includes(FOLDERS.INTERFACES) ||
      normalizedPath.includes(FOLDERS.TYPES))
  )
}
