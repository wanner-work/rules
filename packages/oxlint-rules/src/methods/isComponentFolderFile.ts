import FOLDERS from '../constants/FOLDERS'
import { ensureLeadingSlash } from './toPosixPath'
import toPosixPath from './toPosixPath'

export default function isComponentFolderFile(filePath: string): boolean {
  const normalizedPath = toPosixPath(filePath)
  const rootedPath = ensureLeadingSlash(normalizedPath)

  return rootedPath.includes(FOLDERS.COMPONENTS)
}
