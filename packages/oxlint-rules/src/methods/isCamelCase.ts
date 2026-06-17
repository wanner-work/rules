export default function isCamelCase(value: string): boolean {
  return /^[a-z][A-Za-z0-9]*$/.test(value)
}
