export default function toPosixPath(filePath: string): string {
  return filePath.replaceAll('\\', '/')
}
