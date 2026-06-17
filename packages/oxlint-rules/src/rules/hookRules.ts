import MESSAGE_IDS from '../constants/MESSAGE_IDS'
import getFileNameWithoutExtension from '../methods/getFileNameWithoutExtension'
import getFilePath from '../methods/getFilePath'
import getFunctionNodeFromVariableDeclarator from '../methods/getFunctionNodeFromVariableDeclarator'
import getParameterTypeAnnotation from '../methods/getParameterTypeAnnotation'
import getTypeReferenceIdentifierName from '../methods/getTypeReferenceIdentifierName'
import isLintableHookFile from '../methods/isLintableHookFile'
import isTopLevelFunctionDeclaration from '../methods/isTopLevelFunctionDeclaration'
import isTopLevelFunctionVariable from '../methods/isTopLevelFunctionVariable'
import unwrapTypeWrapper from '../methods/unwrapTypeWrapper'
import type AstNode from '../types/AstNode'
import type RuleModule from '../types/RuleModule'

function isHookName(name: string): boolean {
  return name.startsWith('use')
}

const hookNamingConventionRule: RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require hook names to start with "use".'
    },
    schema: [],
    messages: {
      [MESSAGE_IDS.HOOK_NAME_PREFIX]:
        'Hook name "{{name}}" must start with "use".'
    }
  },
  create(context) {
    const lintableHookFile = isLintableHookFile(context)
    const hookNodes: AstNode[] = []

    return {
      FunctionDeclaration(node) {
        if (
          !lintableHookFile ||
          !isTopLevelFunctionDeclaration(node) ||
          node.id?.type !== 'Identifier'
        ) {
          return
        }

        hookNodes.push(node.id)
      },
      VariableDeclarator(node) {
        if (
          !lintableHookFile ||
          !isTopLevelFunctionVariable(node) ||
          node.id.type !== 'Identifier' ||
          !node.init ||
          (node.init.type !== 'ArrowFunctionExpression' &&
            node.init.type !== 'FunctionExpression')
        ) {
          return
        }

        hookNodes.push(node.id)
      },
      ExportDefaultDeclaration(node) {
        if (
          !lintableHookFile ||
          node.declaration.type !== 'FunctionDeclaration' ||
          node.declaration.id?.type !== 'Identifier'
        ) {
          return
        }

        hookNodes.push(node.declaration.id)
      },
      ExportNamedDeclaration(node) {
        if (
          !lintableHookFile ||
          node.declaration?.type !== 'FunctionDeclaration' ||
          node.declaration.id?.type !== 'Identifier'
        ) {
          return
        }

        hookNodes.push(node.declaration.id)
      },
      'Program:exit'() {
        if (!lintableHookFile) {
          return
        }

        hookNodes.forEach((hookNode) => {
          if (!isHookName(hookNode.name)) {
            context.report({
              node: hookNode,
              messageId: MESSAGE_IDS.HOOK_NAME_PREFIX,
              data: {
                name: hookNode.name
              }
            })
          }
        })
      }
    }
  }
}

const hookFileNameMatchesNameRule: RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require hook file names to match hook names.'
    },
    schema: [],
    messages: {
      [MESSAGE_IDS.HOOK_FILENAME]:
        'Hook file name "{{fileName}}" must match hook name "{{name}}".'
    }
  },
  create(context) {
    const lintableHookFile = isLintableHookFile(context)
    const hookNodes: AstNode[] = []

    return {
      FunctionDeclaration(node) {
        if (
          !lintableHookFile ||
          !isTopLevelFunctionDeclaration(node) ||
          node.id?.type !== 'Identifier'
        ) {
          return
        }

        hookNodes.push(node.id)
      },
      VariableDeclarator(node) {
        if (
          !lintableHookFile ||
          !isTopLevelFunctionVariable(node) ||
          node.id.type !== 'Identifier' ||
          !node.init ||
          (node.init.type !== 'ArrowFunctionExpression' &&
            node.init.type !== 'FunctionExpression')
        ) {
          return
        }

        hookNodes.push(node.id)
      },
      ExportDefaultDeclaration(node) {
        if (
          !lintableHookFile ||
          node.declaration.type !== 'FunctionDeclaration' ||
          node.declaration.id?.type !== 'Identifier'
        ) {
          return
        }

        hookNodes.push(node.declaration.id)
      },
      ExportNamedDeclaration(node) {
        if (
          !lintableHookFile ||
          node.declaration?.type !== 'FunctionDeclaration' ||
          node.declaration.id?.type !== 'Identifier'
        ) {
          return
        }

        hookNodes.push(node.declaration.id)
      },
      'Program:exit'() {
        if (!lintableHookFile || hookNodes.length !== 1) {
          return
        }

        const filePath = getFilePath(context)

        if (!filePath) {
          return
        }

        const fileName = getFileNameWithoutExtension(filePath)
        const hookNode = hookNodes[0]

        if (fileName !== hookNode.name) {
          context.report({
            node: hookNode,
            messageId: MESSAGE_IDS.HOOK_FILENAME,
            data: {
              fileName,
              name: hookNode.name
            }
          })
        }
      }
    }
  }
}

const hookOnePerFileRule: RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require hook files to contain only one top-level hook.'
    },
    schema: [],
    messages: {
      [MESSAGE_IDS.HOOK_ONE_PER_FILE]:
        'Hook files must contain only one top-level hook.'
    }
  },
  create(context) {
    const lintableHookFile = isLintableHookFile(context)
    const hookNodes: AstNode[] = []

    return {
      FunctionDeclaration(node) {
        if (
          !lintableHookFile ||
          !isTopLevelFunctionDeclaration(node) ||
          node.id?.type !== 'Identifier'
        ) {
          return
        }

        hookNodes.push(node.id)
      },
      VariableDeclarator(node) {
        if (
          !lintableHookFile ||
          !isTopLevelFunctionVariable(node) ||
          node.id.type !== 'Identifier' ||
          !node.init ||
          (node.init.type !== 'ArrowFunctionExpression' &&
            node.init.type !== 'FunctionExpression')
        ) {
          return
        }

        hookNodes.push(node.id)
      },
      ExportDefaultDeclaration(node) {
        if (
          !lintableHookFile ||
          node.declaration.type !== 'FunctionDeclaration' ||
          node.declaration.id?.type !== 'Identifier'
        ) {
          return
        }

        hookNodes.push(node.declaration.id)
      },
      ExportNamedDeclaration(node) {
        if (
          !lintableHookFile ||
          node.declaration?.type !== 'FunctionDeclaration' ||
          node.declaration.id?.type !== 'Identifier'
        ) {
          return
        }

        hookNodes.push(node.declaration.id)
      },
      'Program:exit'() {
        if (!lintableHookFile || hookNodes.length <= 1) {
          return
        }

        hookNodes.slice(1).forEach((hookNode) => {
          context.report({
            node: hookNode,
            messageId: MESSAGE_IDS.HOOK_ONE_PER_FILE
          })
        })
      }
    }
  }
}

const hookRequireDefaultExportRule: RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require hook files to default export their top-level hook.'
    },
    schema: [],
    messages: {
      [MESSAGE_IDS.HOOK_DEFAULT_EXPORT]:
        'Hook files must default export their top-level hook.'
    }
  },
  create(context) {
    const lintableHookFile = isLintableHookFile(context)
    const hookNames = new Set<string>()
    const hookNodes = new Map<string, AstNode>()
    const defaultExportedNames = new Set<string>()
    let hasDefaultExportedFunctionExpression = false

    return {
      FunctionDeclaration(node) {
        if (
          !lintableHookFile ||
          !isTopLevelFunctionDeclaration(node) ||
          node.id?.type !== 'Identifier'
        ) {
          return
        }

        hookNames.add(node.id.name)
        hookNodes.set(node.id.name, node.id)
      },
      VariableDeclarator(node) {
        if (
          !lintableHookFile ||
          !isTopLevelFunctionVariable(node) ||
          node.id.type !== 'Identifier' ||
          !node.init ||
          (node.init.type !== 'ArrowFunctionExpression' &&
            node.init.type !== 'FunctionExpression')
        ) {
          return
        }

        hookNames.add(node.id.name)
        hookNodes.set(node.id.name, node.id)
      },
      ExportDefaultDeclaration(node) {
        if (!lintableHookFile) {
          return
        }

        if (
          node.declaration.type === 'FunctionDeclaration' &&
          node.declaration.id?.type === 'Identifier'
        ) {
          hookNames.add(node.declaration.id.name)
          hookNodes.set(node.declaration.id.name, node.declaration.id)
          defaultExportedNames.add(node.declaration.id.name)

          return
        }

        if (node.declaration.type === 'Identifier') {
          defaultExportedNames.add(node.declaration.name)

          return
        }

        if (
          node.declaration.type === 'ArrowFunctionExpression' ||
          node.declaration.type === 'FunctionExpression'
        ) {
          hasDefaultExportedFunctionExpression = true
        }
      },
      ExportNamedDeclaration(node) {
        if (!lintableHookFile) {
          return
        }

        if (
          node.declaration?.type === 'FunctionDeclaration' &&
          node.declaration.id?.type === 'Identifier'
        ) {
          hookNames.add(node.declaration.id.name)
          hookNodes.set(node.declaration.id.name, node.declaration.id)
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
        if (!lintableHookFile || hookNames.size === 0) {
          return
        }

        const hasDefaultExportedHook = [...hookNames].some((name) =>
          defaultExportedNames.has(name)
        )

        if (hasDefaultExportedHook || hasDefaultExportedFunctionExpression) {
          return
        }

        const firstName = [...hookNames][0]
        const node = hookNodes.get(firstName)

        if (node) {
          context.report({
            node,
            messageId: MESSAGE_IDS.HOOK_DEFAULT_EXPORT
          })
        }
      }
    }
  }
}

const hookDefaultExportFunctionDeclarationRule: RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Require default exported hooks to be named function declarations.'
    },
    schema: [],
    messages: {
      [MESSAGE_IDS.HOOK_DEFAULT_EXPORT_DECLARATION]:
        'Hooks must default export a named function declaration (arrow/function expressions are not allowed).'
    }
  },
  create(context) {
    const lintableHookFile = isLintableHookFile(context)
    const topLevelFunctionDeclarations = new Map<string, AstNode>()
    const topLevelFunctionVariables = new Map<string, AstNode>()

    return {
      FunctionDeclaration(node) {
        if (
          !lintableHookFile ||
          !isTopLevelFunctionDeclaration(node) ||
          node.id?.type !== 'Identifier'
        ) {
          return
        }

        topLevelFunctionDeclarations.set(node.id.name, node)
      },
      VariableDeclarator(node) {
        if (
          !lintableHookFile ||
          !isTopLevelFunctionVariable(node) ||
          node.id.type !== 'Identifier'
        ) {
          return
        }

        const functionNode = getFunctionNodeFromVariableDeclarator(node)

        if (functionNode) {
          topLevelFunctionVariables.set(node.id.name, functionNode)
        }
      },
      ExportNamedDeclaration(node) {
        if (
          !lintableHookFile ||
          node.declaration?.type !== 'FunctionDeclaration' ||
          node.declaration.id?.type !== 'Identifier'
        ) {
          return
        }

        topLevelFunctionDeclarations.set(
          node.declaration.id.name,
          node.declaration
        )
      },
      ExportDefaultDeclaration(node) {
        if (!lintableHookFile) {
          return
        }

        if (node.declaration.type === 'FunctionDeclaration') {
          if (node.declaration.id?.type !== 'Identifier') {
            context.report({
              node: node.declaration,
              messageId: MESSAGE_IDS.HOOK_DEFAULT_EXPORT_DECLARATION
            })
          }

          return
        }

        if (
          node.declaration.type === 'ArrowFunctionExpression' ||
          node.declaration.type === 'FunctionExpression'
        ) {
          context.report({
            node: node.declaration,
            messageId: MESSAGE_IDS.HOOK_DEFAULT_EXPORT_DECLARATION
          })

          return
        }

        if (node.declaration.type !== 'Identifier') {
          return
        }

        if (topLevelFunctionDeclarations.has(node.declaration.name)) {
          return
        }

        if (topLevelFunctionVariables.has(node.declaration.name)) {
          context.report({
            node: node.declaration,
            messageId: MESSAGE_IDS.HOOK_DEFAULT_EXPORT_DECLARATION
          })
        }
      }
    }
  }
}

const hookOptionsInterfaceRule: RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Allow optional "Options" interfaces in hook files only when local or imported from /types.'
    },
    schema: [],
    messages: {
      [MESSAGE_IDS.HOOK_OPTIONS_INTERFACE_LOCATION]:
        'The "Options" interface must stay local in hook files or be imported from "/types".',
      [MESSAGE_IDS.HOOK_OPTIONS_INTERFACE_USAGE]:
        'Hooks using an "Options" parameter must define a local "Options" interface or import it from "/types".'
    }
  },
  create(context) {
    const lintableHookFile = isLintableHookFile(context)
    let localOptionsInterfaceNode: AstNode | null = null
    const exportedOptionsNodes: AstNode[] = []
    const nonTypesImportedOptionsNodes: AstNode[] = []
    let hasTypesImportedOptions = false
    const hookNodes: AstNode[] = []

    function isTypesPath(importPath: string): boolean {
      return /(^|\/)types(\/|$)/.test(importPath)
    }

    function registerHookNode(node: AstNode): void {
      hookNodes.push(node)
    }

    function hookUsesOptionsType(node: AstNode): boolean {
      const params = node.params ?? []

      return params.some((parameter) => {
        const typeAnnotation = getParameterTypeAnnotation(parameter)
        const unwrappedType = unwrapTypeWrapper(typeAnnotation)

        return getTypeReferenceIdentifierName(unwrappedType) === 'Options'
      })
    }

    return {
      ImportDeclaration(node) {
        const source = node.source

        if (
          !lintableHookFile ||
          source?.type !== 'Literal' ||
          typeof source.value !== 'string'
        ) {
          return
        }

        const importPath = source.value.replaceAll('\\\\', '/')

        node.specifiers?.forEach((specifier: AstNode) => {
          if (
            specifier.local?.type !== 'Identifier' ||
            specifier.local.name !== 'Options'
          ) {
            return
          }

          if (isTypesPath(importPath)) {
            hasTypesImportedOptions = true

            return
          }

          nonTypesImportedOptionsNodes.push(specifier.local)
        })
      },
      TSInterfaceDeclaration(node) {
        if (!lintableHookFile || node.id?.type !== 'Identifier') {
          return
        }

        if (node.id.name === 'Options') {
          localOptionsInterfaceNode = node
        }
      },
      ExportNamedDeclaration(node) {
        if (!lintableHookFile) {
          return
        }

        if (
          node.declaration?.type === 'TSInterfaceDeclaration' &&
          node.declaration.id?.type === 'Identifier' &&
          node.declaration.id.name === 'Options'
        ) {
          localOptionsInterfaceNode = node.declaration
          exportedOptionsNodes.push(node.declaration.id)

          return
        }

        node.specifiers?.forEach((specifier: AstNode) => {
          if (
            specifier.type === 'ExportSpecifier' &&
            specifier.local?.type === 'Identifier' &&
            specifier.local.name === 'Options'
          ) {
            exportedOptionsNodes.push(specifier.local)
          }
        })

        if (node.declaration?.type === 'FunctionDeclaration') {
          registerHookNode(node.declaration)
        }
      },
      FunctionDeclaration(node) {
        if (!lintableHookFile || !isTopLevelFunctionDeclaration(node)) {
          return
        }

        registerHookNode(node)
      },
      ExportDefaultDeclaration(node) {
        if (
          !lintableHookFile ||
          node.declaration.type !== 'FunctionDeclaration'
        ) {
          return
        }

        registerHookNode(node.declaration)
      },
      VariableDeclarator(node) {
        if (!lintableHookFile || !isTopLevelFunctionVariable(node)) {
          return
        }

        const functionNode = getFunctionNodeFromVariableDeclarator(node)

        if (functionNode) {
          registerHookNode(functionNode)
        }
      },
      'Program:exit'(node) {
        if (!lintableHookFile) {
          return
        }

        exportedOptionsNodes.forEach((optionsNode) => {
          context.report({
            node: optionsNode,
            messageId: MESSAGE_IDS.HOOK_OPTIONS_INTERFACE_LOCATION
          })
        })

        nonTypesImportedOptionsNodes.forEach((optionsNode) => {
          context.report({
            node: optionsNode,
            messageId: MESSAGE_IDS.HOOK_OPTIONS_INTERFACE_LOCATION
          })
        })

        const usesOptionsType = hookNodes.some((hookNode) =>
          hookUsesOptionsType(hookNode)
        )

        if (
          usesOptionsType &&
          !localOptionsInterfaceNode &&
          !hasTypesImportedOptions
        ) {
          context.report({
            node: hookNodes[0] ?? node,
            messageId: MESSAGE_IDS.HOOK_OPTIONS_INTERFACE_USAGE
          })
        }
      }
    }
  }
}

const HOOK_RULES = {
  hookNamingConventionRule,
  hookFileNameMatchesNameRule,
  hookOnePerFileRule,
  hookRequireDefaultExportRule,
  hookDefaultExportFunctionDeclarationRule,
  hookOptionsInterfaceRule
}

export default HOOK_RULES
