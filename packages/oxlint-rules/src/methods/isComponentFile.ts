import FILE_PATTERNS from '../constants/FILE_PATTERNS'
import FOLDERS from '../constants/FOLDERS'
import toPosixPath from './toPosixPath'

export default function isComponentFile(filePath: string): boolean {
  const normalizedPath = toPosixPath(filePath)

  return (
    FILE_PATTERNS.COMPONENT.test(normalizedPath) &&
    normalizedPath.includes(FOLDERS.COMPONENTS)
  )
}
