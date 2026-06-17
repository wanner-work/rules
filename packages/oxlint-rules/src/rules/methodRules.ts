import MESSAGE_IDS from '../constants/MESSAGE_IDS'
import getFunctionNodeFromVariableDeclarator from '../methods/getFunctionNodeFromVariableDeclarator'
import getParameterTypeAnnotation from '../methods/getParameterTypeAnnotation'
import getTypeReferenceIdentifierName from '../methods/getTypeReferenceIdentifierName'
import isCamelCase from '../methods/isCamelCase'
import isLintableComponentFile from '../methods/isLintableComponentFile'
import isLintableMethodFile from '../methods/isLintableMethodFile'
import isTopLevelFunctionDeclaration from '../methods/isTopLevelFunctionDeclaration'
import isTopLevelFunctionVariable from '../methods/isTopLevelFunctionVariable'
import unwrapTypeWrapper from '../methods/unwrapTypeWrapper'
import type AstNode from '../types/AstNode'
import type RuleModule from '../types/RuleModule'

const methodNameCamelCaseRule: RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require method names to use camelCase.'
    },
    schema: [],
    messages: {
      [MESSAGE_IDS.METHOD_NAME_CAMEL_CASE]:
        'Method name "{{name}}" must be camelCase.'
    }
  },
  create(context) {
    const lintableMethodFile = isLintableMethodFile(context)
    const methodDeclarations: Array<{ name: string; node: AstNode }> = []

    function registerMethod(name: string, node: AstNode): void {
      methodDeclarations.push({ name, node })
    }

    return {
      FunctionDeclaration(node) {
        if (
          !lintableMethodFile ||
          !isTopLevelFunctionDeclaration(node) ||
          node.id?.type !== 'Identifier'
        ) {
          return
        }

        registerMethod(node.id.name, node.id)
      },
      VariableDeclarator(node) {
        if (
          !lintableMethodFile ||
          !isTopLevelFunctionVariable(node) ||
          node.id.type !== 'Identifier' ||
          !node.init ||
          (node.init.type !== 'ArrowFunctionExpression' &&
            node.init.type !== 'FunctionExpression')
        ) {
          return
        }

        registerMethod(node.id.name, node.id)
      },
      'Program:exit'() {
        if (!lintableMethodFile) {
          return
        }

        methodDeclarations.forEach((methodDeclaration) => {
          if (!isCamelCase(methodDeclaration.name)) {
            context.report({
              node: methodDeclaration.node,
              messageId: MESSAGE_IDS.METHOD_NAME_CAMEL_CASE,
              data: {
                name: methodDeclaration.name
              }
            })
          }
        })
      }
    }
  }
}

const methodOnePerFileRule: RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require method files to contain only one top-level method.'
    },
    schema: [],
    messages: {
      [MESSAGE_IDS.METHOD_ONE_PER_FILE]:
        'Method files must contain only one top-level method.'
    }
  },
  create(context) {
    const lintableMethodFile = isLintableMethodFile(context)
    const methodDeclarations: AstNode[] = []

    return {
      FunctionDeclaration(node) {
        if (
          !lintableMethodFile ||
          !isTopLevelFunctionDeclaration(node) ||
          node.id?.type !== 'Identifier'
        ) {
          return
        }

        methodDeclarations.push(node.id)
      },
      VariableDeclarator(node) {
        if (
          !lintableMethodFile ||
          !isTopLevelFunctionVariable(node) ||
          node.id.type !== 'Identifier' ||
          !node.init ||
          (node.init.type !== 'ArrowFunctionExpression' &&
            node.init.type !== 'FunctionExpression')
        ) {
          return
        }

        methodDeclarations.push(node.id)
      },
      'Program:exit'() {
        if (!lintableMethodFile || methodDeclarations.length <= 1) {
          return
        }

        methodDeclarations.slice(1).forEach((methodNode) => {
          context.report({
            node: methodNode,
            messageId: MESSAGE_IDS.METHOD_ONE_PER_FILE
          })
        })
      }
    }
  }
}

const methodRequireDefaultExportRule: RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Require method files to default export their top-level method.'
    },
    schema: [],
    messages: {
      [MESSAGE_IDS.METHOD_DEFAULT_EXPORT]:
        'Method files must default export their top-level method.'
    }
  },
  create(context) {
    const lintableMethodFile = isLintableMethodFile(context)
    const methodNames = new Set<string>()
    const methodNodes = new Map<string, AstNode>()
    const defaultExportedNames = new Set<string>()
    let hasDefaultExportedFunctionExpression = false

    return {
      FunctionDeclaration(node) {
        if (
          !lintableMethodFile ||
          !isTopLevelFunctionDeclaration(node) ||
          node.id?.type !== 'Identifier'
        ) {
          return
        }

        methodNames.add(node.id.name)
        methodNodes.set(node.id.name, node.id)
      },
      VariableDeclarator(node) {
        if (
          !lintableMethodFile ||
          !isTopLevelFunctionVariable(node) ||
          node.id.type !== 'Identifier' ||
          !node.init ||
          (node.init.type !== 'ArrowFunctionExpression' &&
            node.init.type !== 'FunctionExpression')
        ) {
          return
        }

        methodNames.add(node.id.name)
        methodNodes.set(node.id.name, node.id)
      },
      ExportDefaultDeclaration(node) {
        if (!lintableMethodFile) {
          return
        }

        if (
          node.declaration.type === 'FunctionDeclaration' &&
          node.declaration.id?.type === 'Identifier'
        ) {
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
        if (!lintableMethodFile) {
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
        if (!lintableMethodFile || methodNames.size === 0) {
          return
        }

        const hasDefaultExportedMethod = [...methodNames].some((name) =>
          defaultExportedNames.has(name)
        )

        if (hasDefaultExportedMethod || hasDefaultExportedFunctionExpression) {
          return
        }

        const firstName = [...methodNames][0]
        const node = methodNodes.get(firstName)

        if (node) {
          context.report({
            node,
            messageId: MESSAGE_IDS.METHOD_DEFAULT_EXPORT
          })
        }
      }
    }
  }
}

const methodOptionsInterfaceRule: RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Allow optional "Options" interfaces in method files only when local or imported from /types.'
    },
    schema: [],
    messages: {
      [MESSAGE_IDS.METHOD_OPTIONS_INTERFACE_LOCATION]:
        'The "Options" interface must stay local in method files or be imported from "/types".',
      [MESSAGE_IDS.METHOD_OPTIONS_INTERFACE_USAGE]:
        'Methods using an "Options" parameter must define a local "Options" interface or import it from "/types".'
    }
  },
  create(context) {
    const lintableMethodFile = isLintableMethodFile(context)
    let localOptionsInterfaceNode: AstNode | null = null
    const exportedOptionsNodes: AstNode[] = []
    const nonTypesImportedOptionsNodes: AstNode[] = []
    let hasTypesImportedOptions = false
    const methodNodes: AstNode[] = []

    function isTypesPath(importPath: string): boolean {
      return /(^|\/)types(\/|$)/.test(importPath)
    }

    function registerMethodNode(node: AstNode): void {
      methodNodes.push(node)
    }

    function methodUsesOptionsType(node: AstNode): boolean {
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
          !lintableMethodFile ||
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
        if (!lintableMethodFile || node.id?.type !== 'Identifier') {
          return
        }

        if (node.id.name === 'Options') {
          localOptionsInterfaceNode = node
        }
      },
      ExportNamedDeclaration(node) {
        if (!lintableMethodFile) {
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
      },
      FunctionDeclaration(node) {
        if (!lintableMethodFile || !isTopLevelFunctionDeclaration(node)) {
          return
        }

        registerMethodNode(node)
      },
      VariableDeclarator(node) {
        if (!lintableMethodFile || !isTopLevelFunctionVariable(node)) {
          return
        }

        const functionNode = getFunctionNodeFromVariableDeclarator(node)

        if (functionNode) {
          registerMethodNode(functionNode)
        }
      },
      'Program:exit'(node) {
        if (!lintableMethodFile) {
          return
        }

        exportedOptionsNodes.forEach((optionsNode) => {
          context.report({
            node: optionsNode,
            messageId: MESSAGE_IDS.METHOD_OPTIONS_INTERFACE_LOCATION
          })
        })

        nonTypesImportedOptionsNodes.forEach((optionsNode) => {
          context.report({
            node: optionsNode,
            messageId: MESSAGE_IDS.METHOD_OPTIONS_INTERFACE_LOCATION
          })
        })

        const usesOptionsType = methodNodes.some((methodNode) =>
          methodUsesOptionsType(methodNode)
        )

        if (
          usesOptionsType &&
          !localOptionsInterfaceNode &&
          !hasTypesImportedOptions
        ) {
          context.report({
            node: methodNodes[0] ?? node,
            messageId: MESSAGE_IDS.METHOD_OPTIONS_INTERFACE_USAGE
          })
        }
      }
    }
  }
}

const methodOutsideComponentsFunctionDeclarationRule: RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Require methods outside components to use function declarations.'
    },
    schema: [],
    messages: {
      [MESSAGE_IDS.METHOD_OUTSIDE_COMPONENTS_DECLARATION]:
        'Methods outside components must use function declarations (arrow/function expression not allowed).'
    }
  },
  create(context) {
    const lintableMethodFile = isLintableMethodFile(context)

    return {
      VariableDeclarator(node) {
        if (!lintableMethodFile || !isTopLevelFunctionVariable(node)) {
          return
        }

        const functionNode = getFunctionNodeFromVariableDeclarator(node)

        if (!functionNode) {
          return
        }

        context.report({
          node: node.id,
          messageId: MESSAGE_IDS.METHOD_OUTSIDE_COMPONENTS_DECLARATION
        })
      },
      ExportDefaultDeclaration(node) {
        if (!lintableMethodFile) {
          return
        }

        if (
          node.declaration.type === 'ArrowFunctionExpression' ||
          node.declaration.type === 'FunctionExpression'
        ) {
          context.report({
            node: node.declaration,
            messageId: MESSAGE_IDS.METHOD_OUTSIDE_COMPONENTS_DECLARATION
          })
        }
      }
    }
  }
}

const methodInsideComponentsArrowFunctionRule: RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Require methods declared inside components to use arrow functions.'
    },
    schema: [],
    messages: {
      [MESSAGE_IDS.METHOD_INSIDE_COMPONENTS_ARROW]:
        'Methods inside components must use arrow functions.'
    }
  },
  create(context) {
    const lintableComponentFile = isLintableComponentFile(context)
    const topLevelFunctionDeclarations = new Map<string, AstNode>()
    const topLevelFunctionVariableDeclarations = new Map<string, AstNode>()
    const componentFunctionRanges: Array<{ start: number; end: number }> = []
    const violations: AstNode[] = []

    function addTopLevelFunctionDeclaration(node: AstNode): void {
      if (
        node.id?.type === 'Identifier' &&
        isTopLevelFunctionDeclaration(node)
      ) {
        topLevelFunctionDeclarations.set(node.id.name, node)
      }
    }

    function addTopLevelFunctionVariableDeclaration(node: AstNode): void {
      if (!isTopLevelFunctionVariable(node) || node.id.type !== 'Identifier') {
        return
      }

      const functionNode = getFunctionNodeFromVariableDeclarator(node)

      if (functionNode) {
        topLevelFunctionVariableDeclarations.set(node.id.name, functionNode)
      }
    }

    function findEnclosingFunction(node: AstNode): AstNode | null {
      let current = node.parent

      while (current) {
        if (
          current.type === 'FunctionDeclaration' ||
          current.type === 'FunctionExpression' ||
          current.type === 'ArrowFunctionExpression'
        ) {
          return current
        }

        current = current.parent
      }

      return null
    }

    function isInsideComponentFunction(node: AstNode): boolean {
      if (
        typeof node.start !== 'number' ||
        typeof node.end !== 'number' ||
        componentFunctionRanges.length === 0
      ) {
        return false
      }

      return componentFunctionRanges.some(
        (range) => node.start > range.start && node.end < range.end
      )
    }

    return {
      FunctionDeclaration(node) {
        if (!lintableComponentFile) {
          return
        }

        addTopLevelFunctionDeclaration(node)

        if (!node.id?.type || isTopLevelFunctionDeclaration(node)) {
          return
        }

        const enclosingFunction = findEnclosingFunction(node)

        if (enclosingFunction) {
          violations.push(node.id)
        }
      },
      VariableDeclarator(node) {
        if (!lintableComponentFile) {
          return
        }

        addTopLevelFunctionVariableDeclaration(node)

        const functionNode = getFunctionNodeFromVariableDeclarator(node)

        if (!functionNode || node.id.type !== 'Identifier') {
          return
        }

        if (functionNode.type === 'ArrowFunctionExpression') {
          return
        }

        const enclosingFunction = findEnclosingFunction(node)

        if (enclosingFunction) {
          violations.push(node.id)
        }
      },
      ExportDefaultDeclaration(node) {
        if (!lintableComponentFile) {
          return
        }

        if (node.declaration.type === 'FunctionDeclaration') {
          if (
            typeof node.declaration.start === 'number' &&
            typeof node.declaration.end === 'number'
          ) {
            componentFunctionRanges.push({
              start: node.declaration.start,
              end: node.declaration.end
            })
          }

          return
        }

        if (node.declaration.type === 'Identifier') {
          const functionDeclaration = topLevelFunctionDeclarations.get(
            node.declaration.name
          )

          if (
            functionDeclaration &&
            typeof functionDeclaration.start === 'number' &&
            typeof functionDeclaration.end === 'number'
          ) {
            componentFunctionRanges.push({
              start: functionDeclaration.start,
              end: functionDeclaration.end
            })

            return
          }

          const functionVariable = topLevelFunctionVariableDeclarations.get(
            node.declaration.name
          )

          if (
            functionVariable &&
            typeof functionVariable.start === 'number' &&
            typeof functionVariable.end === 'number'
          ) {
            componentFunctionRanges.push({
              start: functionVariable.start,
              end: functionVariable.end
            })
          }
        }
      },
      'Program:exit'() {
        if (!lintableComponentFile || componentFunctionRanges.length === 0) {
          return
        }

        violations.forEach((violationNode) => {
          if (isInsideComponentFunction(violationNode)) {
            context.report({
              node: violationNode,
              messageId: MESSAGE_IDS.METHOD_INSIDE_COMPONENTS_ARROW
            })
          }
        })
      }
    }
  }
}

const METHOD_RULES = {
  methodNameCamelCaseRule,
  methodOnePerFileRule,
  methodRequireDefaultExportRule,
  methodOptionsInterfaceRule,
  methodOutsideComponentsFunctionDeclarationRule,
  methodInsideComponentsArrowFunctionRule
}

export default METHOD_RULES
