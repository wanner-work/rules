import MESSAGE_IDS from '../constants/MESSAGE_IDS'
import getFileNameWithoutExtension from '../methods/getFileNameWithoutExtension'
import getFilePath from '../methods/getFilePath'
import isLintableConstantFile from '../methods/isLintableConstantFile'
import type AstNode from '../types/AstNode'
import type RuleModule from '../types/RuleModule'

function isTopLevelConstDeclarator(node: AstNode): boolean {
  return (
    node.parent?.type === 'VariableDeclaration' &&
    node.parent.kind === 'const' &&
    node.parent.parent?.type === 'Program'
  )
}

function isUppercaseSnakeCase(name: string): boolean {
  return /^[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)*$/.test(name)
}

function getDefaultExportedConstantNodes(
  constantNodes: AstNode[],
  defaultExportedNames: Set<string>
): AstNode[] {
  const exportedConstantNodes = constantNodes.filter((constantNode) =>
    defaultExportedNames.has(constantNode.name)
  )

  if (exportedConstantNodes.length > 0) {
    return exportedConstantNodes
  }

  return constantNodes
}

const constantNamingConventionRule: RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Require readonly constants to use UPPERCASE_SNAKE_CASE names.'
    },
    schema: [],
    messages: {
      [MESSAGE_IDS.CONSTANT_NAME_UPPERCASE_SNAKE_CASE]:
        'Readonly constant name "{{name}}" must be UPPERCASE_SNAKE_CASE.'
    }
  },
  create(context) {
    const lintableConstantFile = isLintableConstantFile(context)
    const constantNodes: AstNode[] = []
    const defaultExportedNames = new Set<string>()

    return {
      VariableDeclarator(node) {
        if (
          !lintableConstantFile ||
          !isTopLevelConstDeclarator(node) ||
          node.id.type !== 'Identifier'
        ) {
          return
        }

        constantNodes.push(node.id)
      },
      ExportDefaultDeclaration(node) {
        if (!lintableConstantFile) {
          return
        }

        if (node.declaration.type === 'Identifier') {
          defaultExportedNames.add(node.declaration.name)
        }
      },
      ExportNamedDeclaration(node) {
        if (!lintableConstantFile) {
          return
        }

        node.specifiers?.forEach((specifier: AstNode) => {
          if (
            specifier.type === 'ExportSpecifier' &&
            specifier.exported?.type === 'Identifier' &&
            specifier.exported.name === 'default' &&
            specifier.local?.type === 'Identifier'
          ) {
            defaultExportedNames.add(specifier.local.name)
          }
        })
      },
      'Program:exit'() {
        if (!lintableConstantFile) {
          return
        }

        const targetNodes = getDefaultExportedConstantNodes(
          constantNodes,
          defaultExportedNames
        )

        targetNodes.forEach((constantNode) => {
          if (!isUppercaseSnakeCase(constantNode.name)) {
            context.report({
              node: constantNode,
              messageId: MESSAGE_IDS.CONSTANT_NAME_UPPERCASE_SNAKE_CASE,
              data: {
                name: constantNode.name
              }
            })
          }
        })
      }
    }
  }
}

const constantSingleObjectRule: RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Require readonly constants files to group values in one top-level object.'
    },
    schema: [],
    messages: {
      [MESSAGE_IDS.CONSTANT_SINGLE_OBJECT]:
        'Readonly constants must be grouped into a single top-level object constant.'
    }
  },
  create(context) {
    const lintableConstantFile = isLintableConstantFile(context)
    const constantDeclarators: AstNode[] = []
    const defaultExportedNames = new Set<string>()

    return {
      VariableDeclarator(node) {
        if (!lintableConstantFile || !isTopLevelConstDeclarator(node)) {
          return
        }

        constantDeclarators.push(node)
      },
      ExportDefaultDeclaration(node) {
        if (!lintableConstantFile) {
          return
        }

        if (node.declaration.type === 'Identifier') {
          defaultExportedNames.add(node.declaration.name)
        }
      },
      ExportNamedDeclaration(node) {
        if (!lintableConstantFile) {
          return
        }

        node.specifiers?.forEach((specifier: AstNode) => {
          if (
            specifier.type === 'ExportSpecifier' &&
            specifier.exported?.type === 'Identifier' &&
            specifier.exported.name === 'default' &&
            specifier.local?.type === 'Identifier'
          ) {
            defaultExportedNames.add(specifier.local.name)
          }
        })
      },
      'Program:exit'(node) {
        if (!lintableConstantFile || constantDeclarators.length === 0) {
          return
        }

        const exportedConstantDeclarators = constantDeclarators.filter(
          (constantDeclarator) =>
            constantDeclarator.id?.type === 'Identifier' &&
            defaultExportedNames.has(constantDeclarator.id.name)
        )
        const targetDeclarators =
          exportedConstantDeclarators.length > 0
            ? exportedConstantDeclarators
            : constantDeclarators

        if (targetDeclarators.length !== 1) {
          const violationNode = targetDeclarators[1]?.id ?? node

          context.report({
            node: violationNode,
            messageId: MESSAGE_IDS.CONSTANT_SINGLE_OBJECT
          })

          return
        }

        const constantNode = targetDeclarators[0]

        if (constantNode.init?.type !== 'ObjectExpression') {
          context.report({
            node: constantNode.id,
            messageId: MESSAGE_IDS.CONSTANT_SINGLE_OBJECT
          })
        }
      }
    }
  }
}

const constantFileNameMatchesNameRule: RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require constant file names to match constant names.'
    },
    schema: [],
    messages: {
      [MESSAGE_IDS.CONSTANT_FILENAME]:
        'Constant file name "{{fileName}}" must match constant name "{{name}}".'
    }
  },
  create(context) {
    const lintableConstantFile = isLintableConstantFile(context)
    const constantNodes: AstNode[] = []
    const defaultExportedNames = new Set<string>()

    return {
      VariableDeclarator(node) {
        if (
          !lintableConstantFile ||
          !isTopLevelConstDeclarator(node) ||
          node.id.type !== 'Identifier'
        ) {
          return
        }

        constantNodes.push(node.id)
      },
      ExportDefaultDeclaration(node) {
        if (!lintableConstantFile) {
          return
        }

        if (node.declaration.type === 'Identifier') {
          defaultExportedNames.add(node.declaration.name)
        }
      },
      ExportNamedDeclaration(node) {
        if (!lintableConstantFile) {
          return
        }

        node.specifiers?.forEach((specifier: AstNode) => {
          if (
            specifier.type === 'ExportSpecifier' &&
            specifier.exported?.type === 'Identifier' &&
            specifier.exported.name === 'default' &&
            specifier.local?.type === 'Identifier'
          ) {
            defaultExportedNames.add(specifier.local.name)
          }
        })
      },
      'Program:exit'() {
        if (!lintableConstantFile || constantNodes.length === 0) {
          return
        }

        const filePath = getFilePath(context)

        if (!filePath) {
          return
        }

        const fileName = getFileNameWithoutExtension(filePath)

        const targetNodes = getDefaultExportedConstantNodes(
          constantNodes,
          defaultExportedNames
        )

        targetNodes.forEach((constantNode) => {
          if (constantNode.name !== fileName) {
            context.report({
              node: constantNode,
              messageId: MESSAGE_IDS.CONSTANT_FILENAME,
              data: {
                fileName,
                name: constantNode.name
              }
            })
          }
        })
      }
    }
  }
}

const constantRequireDefaultExportRule: RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Require readonly constants files to default export their constants object.'
    },
    schema: [],
    messages: {
      [MESSAGE_IDS.CONSTANT_DEFAULT_EXPORT]:
        'Readonly constants object must be default exported.'
    }
  },
  create(context) {
    const lintableConstantFile = isLintableConstantFile(context)
    const constantNames = new Set<string>()
    const constantNodes = new Map<string, AstNode>()
    const defaultExportedNames = new Set<string>()

    return {
      VariableDeclarator(node) {
        if (
          !lintableConstantFile ||
          !isTopLevelConstDeclarator(node) ||
          node.id.type !== 'Identifier'
        ) {
          return
        }

        constantNames.add(node.id.name)
        constantNodes.set(node.id.name, node.id)
      },
      ExportDefaultDeclaration(node) {
        if (!lintableConstantFile) {
          return
        }

        if (node.declaration.type === 'Identifier') {
          defaultExportedNames.add(node.declaration.name)
        }
      },
      ExportNamedDeclaration(node) {
        if (!lintableConstantFile) {
          return
        }

        node.specifiers?.forEach((specifier: AstNode) => {
          if (
            specifier.type === 'ExportSpecifier' &&
            specifier.exported?.type === 'Identifier' &&
            specifier.exported.name === 'default' &&
            specifier.local?.type === 'Identifier'
          ) {
            defaultExportedNames.add(specifier.local.name)
          }
        })
      },
      'Program:exit'() {
        if (!lintableConstantFile || constantNames.size === 0) {
          return
        }

        const hasDefaultExportedConstantsObject = [...constantNames].some(
          (name) => defaultExportedNames.has(name)
        )

        if (hasDefaultExportedConstantsObject) {
          return
        }

        const firstName = [...constantNames][0]
        const node = constantNodes.get(firstName)

        if (node) {
          context.report({
            node,
            messageId: MESSAGE_IDS.CONSTANT_DEFAULT_EXPORT
          })
        }
      }
    }
  }
}

const CONSTANT_RULES = {
  constantNamingConventionRule,
  constantFileNameMatchesNameRule,
  constantSingleObjectRule,
  constantRequireDefaultExportRule
}

export default CONSTANT_RULES
