import isInFolder from './isInFolder'

export default function isComponentFolderFile(filePath: string): boolean {
  return isInFolder(filePath, 'components')
}
