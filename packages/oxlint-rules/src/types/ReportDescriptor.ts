import type AstNode from './AstNode'

export default interface ReportDescriptor {
  node: AstNode
  messageId: string
  data?: Record<string, string>
}
