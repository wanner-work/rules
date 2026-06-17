import MESSAGE_IDS from '../constants/MESSAGE_IDS'
import getFileNameWithoutExtension from '../methods/getFileNameWithoutExtension'
import getFilePath from '../methods/getFilePath'
import isLintableInterfaceFile from '../methods/isLintableInterfaceFile'
import isPascalCase from '../methods/isPascalCase'
import type AstNode from '../types/AstNode'
import type RuleModule from '../types/RuleModule'

const interfaceNamePascalCaseRule: RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require interface names to use PascalCase.'
    },
    schema: [],
    messages: {
      [MESSAGE_IDS.INTERFACE_NAME_PASCAL_CASE]:
        'Interface name "{{name}}" must be PascalCase.'
    }
  },
  create(context) {
    const lintableInterfaceFile = isLintableInterfaceFile(context)
    const interfaceDeclarations: AstNode[] = []

    return {
      TSInterfaceDeclaration(node) {
        if (!lintableInterfaceFile || node.id?.type !== 'Identifier') {
          return
        }

        interfaceDeclarations.push(node)
      },
      'Program:exit'() {
        if (!lintableInterfaceFile) {
          return
        }

        interfaceDeclarations.forEach((declaration) => {
          if (!isPascalCase(declaration.id.name)) {
            context.report({
              node: declaration.id,
              messageId: MESSAGE_IDS.INTERFACE_NAME_PASCAL_CASE,
              data: {
                name: declaration.id.name
              }
            })
          }
        })
      }
    }
  }
}

const interfaceFileNameMatchesNameRule: RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require interface file names to match interface names.'
    },
    schema: [],
    messages: {
      [MESSAGE_IDS.INTERFACE_FILENAME]:
        'Interface file name "{{fileName}}" must match interface name "{{name}}".'
    }
  },
  create(context) {
    const lintableInterfaceFile = isLintableInterfaceFile(context)
    const interfaceDeclarations: AstNode[] = []

    return {
      TSInterfaceDeclaration(node) {
        if (!lintableInterfaceFile || node.id?.type !== 'Identifier') {
          return
        }

        interfaceDeclarations.push(node)
      },
      'Program:exit'() {
        if (!lintableInterfaceFile || interfaceDeclarations.length !== 1) {
          return
        }

        const filePath = getFilePath(context)

        if (!filePath) {
          return
        }

        const declaration = interfaceDeclarations[0]
        const fileName = getFileNameWithoutExtension(filePath)

        if (fileName !== declaration.id.name) {
          context.report({
            node: declaration.id,
            messageId: MESSAGE_IDS.INTERFACE_FILENAME,
            data: {
              fileName,
              name: declaration.id.name
            }
          })
        }
      }
    }
  }
}

const interfaceOnePerFileRule: RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Require exactly one interface declaration per interface file.'
    },
    schema: [],
    messages: {
      [MESSAGE_IDS.INTERFACE_ONE_PER_FILE]:
        'Interface files must contain only one interface declaration.'
    }
  },
  create(context) {
    const lintableInterfaceFile = isLintableInterfaceFile(context)
    const interfaceDeclarations: AstNode[] = []

    return {
      TSInterfaceDeclaration(node) {
        if (!lintableInterfaceFile || node.id?.type !== 'Identifier') {
          return
        }

        interfaceDeclarations.push(node)
      },
      'Program:exit'() {
        if (!lintableInterfaceFile || interfaceDeclarations.length <= 1) {
          return
        }

        interfaceDeclarations.slice(1).forEach((declaration) => {
          context.report({
            node: declaration.id,
            messageId: MESSAGE_IDS.INTERFACE_ONE_PER_FILE
          })
        })
      }
    }
  }
}

const interfaceRequireDefaultExportRule: RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Require interface declarations in interface files to be default exported.'
    },
    schema: [],
    messages: {
      [MESSAGE_IDS.INTERFACE_DEFAULT_EXPORT]:
        'Interface files must default export their interface declaration.'
    }
  },
  create(context) {
    const lintableInterfaceFile = isLintableInterfaceFile(context)
    const interfaceNames = new Set<string>()
    const interfaceNodes = new Map<string, AstNode>()
    const defaultExportedNames = new Set<string>()

    return {
      TSInterfaceDeclaration(node) {
        if (!lintableInterfaceFile || node.id?.type !== 'Identifier') {
          return
        }

        interfaceNames.add(node.id.name)
        interfaceNodes.set(node.id.name, node.id)
      },
      ExportDefaultDeclaration(node) {
        if (!lintableInterfaceFile) {
          return
        }

        if (
          node.declaration.type === 'TSInterfaceDeclaration' &&
          node.declaration.id?.type === 'Identifier'
        ) {
          defaultExportedNames.add(node.declaration.id.name)

          return
        }

        if (node.declaration.type === 'Identifier') {
          defaultExportedNames.add(node.declaration.name)
        }
      },
      ExportNamedDeclaration(node) {
        if (!lintableInterfaceFile) {
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
        if (!lintableInterfaceFile || interfaceNames.size === 0) {
          return
        }

        const hasDefaultExportedInterface = [...interfaceNames].some((name) =>
          defaultExportedNames.has(name)
        )

        if (!hasDefaultExportedInterface) {
          const firstName = [...interfaceNames][0]
          const node = interfaceNodes.get(firstName)

          if (node) {
            context.report({
              node,
              messageId: MESSAGE_IDS.INTERFACE_DEFAULT_EXPORT
            })
          }
        }
      }
    }
  }
}

const interfaceNoIPrefixRule: RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow interface names with an I prefix.'
    },
    schema: [],
    messages: {
      [MESSAGE_IDS.INTERFACE_NO_I_PREFIX]:
        'Interface name "{{name}}" must not use the "I" prefix (for example "UserData", not "IUserData").'
    }
  },
  create(context) {
    const lintableInterfaceFile = isLintableInterfaceFile(context)
    const interfaceDeclarations: AstNode[] = []

    return {
      TSInterfaceDeclaration(node) {
        if (!lintableInterfaceFile || node.id?.type !== 'Identifier') {
          return
        }

        interfaceDeclarations.push(node)
      },
      'Program:exit'() {
        if (!lintableInterfaceFile) {
          return
        }

        interfaceDeclarations.forEach((declaration) => {
          if (/^I[A-Z]/.test(declaration.id.name)) {
            context.report({
              node: declaration.id,
              messageId: MESSAGE_IDS.INTERFACE_NO_I_PREFIX,
              data: {
                name: declaration.id.name
              }
            })
          }
        })
      }
    }
  }
}

const INTERFACE_RULES = {
  interfaceNamePascalCaseRule,
  interfaceFileNameMatchesNameRule,
  interfaceOnePerFileRule,
  interfaceRequireDefaultExportRule,
  interfaceNoIPrefixRule
}

export default INTERFACE_RULES
