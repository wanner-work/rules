import FILE_PATTERNS from '../constants/FILE_PATTERNS'
import FOLDERS from '../constants/FOLDERS'
import toPosixPath from './toPosixPath'

export default function isHookFile(filePath: string): boolean {
  const normalizedPath = toPosixPath(filePath)

  return (
    FILE_PATTERNS.HOOK.test(normalizedPath) &&
    normalizedPath.includes(FOLDERS.HOOKS)
  )
}
