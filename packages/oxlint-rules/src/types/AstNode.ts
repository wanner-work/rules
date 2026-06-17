export default interface AstNode {
  type: string
  name: string
  id: AstNode
  init: AstNode
  declaration: AstNode
  source: AstNode
  local: AstNode
  exported: AstNode
  argument: AstNode
  left: AstNode
  value: unknown
  params: AstNode[]
  specifiers: AstNode[]
  typeName: AstNode
  typeAnnotation: AstNode
  typeParameters: {
    params: AstNode[]
  }
  typeArguments: {
    params: AstNode[]
  }
  parent: AstNode
  start: number
  end: number
  [key: string]: unknown
}
