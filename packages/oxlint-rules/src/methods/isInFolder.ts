import FOLDERS from '../constants/FOLDERS'
import { ensureLeadingSlash } from './toPosixPath'
import toPosixPath from './toPosixPath'

const KNOWN_FOLDERS = Object.values(FOLDERS).map((folder) =>
  folder.replace(/^\/|\/$/g, '')
)

export default function isInFolder(
  filePath: string,
  folderName: string
): boolean {
  const normalizedPath = toPosixPath(filePath)
  const rootedPath = ensureLeadingSlash(normalizedPath)

  const folderSegment = `/${folderName}/`

  const folderIndex = rootedPath.indexOf(folderSegment)

  if (folderIndex === -1) {
    return false
  }

  const otherKnownFolders = KNOWN_FOLDERS.filter(
    (knownFolder) => knownFolder !== folderName
  )

  for (const knownFolder of otherKnownFolders) {
    const nestedSegment = `/${knownFolder}/${folderName}/`

    if (rootedPath.includes(nestedSegment)) {
      return false
    }
  }

  return true
}