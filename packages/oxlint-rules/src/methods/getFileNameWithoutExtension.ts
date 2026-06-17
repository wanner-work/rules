import toPosixPath from './toPosixPath'

export default function getFileNameWithoutExtension(filePath: string): string {
  const normalizedPath = toPosixPath(filePath)
  const fileName = normalizedPath.split('/').pop() ?? ''

  return fileName.replace(/\.[^.]+$/, '')
}
