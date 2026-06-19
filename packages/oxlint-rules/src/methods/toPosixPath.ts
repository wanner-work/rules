export default function toPosixPath(filePath: string): string {
  return filePath.replaceAll('\\', '/')
}

export function ensureLeadingSlash(filePath: string): string {
  return filePath.startsWith('/') ? filePath : `/${filePath}`
}
