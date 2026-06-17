import type ReportDescriptor from './ReportDescriptor'

export default interface LintContext {
  filename?: string | null
  getFilename?: () => string | null
  report: (descriptor: ReportDescriptor) => void
}
