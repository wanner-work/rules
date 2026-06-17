export default function isPascalCase(value: string): boolean {
  return /^[A-Z][A-Za-z0-9]*$/.test(value)
}
