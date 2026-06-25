import MESSAGE_IDS from '../constants/MESSAGE_IDS'
import getFileNameWithoutExtension from '../methods/getFileNameWithoutExtension'
import getFilePath from '../methods/getFilePath'
import getParameterTypeAnnotation from '../methods/getParameterTypeAnnotation'
import getTypeReferenceIdentifierName from '../methods/getTypeReferenceIdentifierName'
import isComponentFile from '../methods/isComponentFile'
import isComponentFolderFile from '../methods/isComponentFolderFile'
import isLintableComponentFile from '../methods/isLintableComponentFile'
import isLintableComponentFolderFile from '../methods/isLintableComponentFolderFile'
import startsWithUppercase from '../methods/startsWithUppercase'
import unwrapTypeWrapper from '../methods/unwrapTypeWrapper'
import type AstNode from '../types/AstNode'
import type RuleModule from '../types/RuleModule'

const componentNamingConventionRule: RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Require component default export names to start uppercase and match file names.'
    },
    schema: [],
    messages: {
      [MESSAGE_IDS.COMPONENT_UPPERCASE]:
        'Component name "{{name}}" must start with an uppercase letter.',
      [MESSAGE_IDS.COMPONENT_FILENAME]:
        'File name "{{fileName}}" must match component name "{{name}}".'
    }
  },
  create(context) {
    let defaultExportName: string | null = null
    let defaultExportNameNode: AstNode | null = null

    return {
      ExportDefaultDeclaration(node) {
        const declaration = node.declaration

        if (
          (declaration.type === 'FunctionDeclaration' ||
            declaration.type === 'ClassDeclaration') &&
          declaration.id?.type === 'Identifier'
        ) {
          defaultExportName = declaration.id.name
          defaultExportNameNode = declaration.id

          return
        }

        if (declaration.type === 'Identifier') {
          defaultExportName = declaration.name
          defaultExportNameNode = declaration
        }
      },
      'Program:exit'() {
        const filePath = getFilePath(context)

        if (
          !filePath ||
          filePath === '<input>' ||
          !isComponentFile(filePath) ||
          !defaultExportName ||
          !defaultExportNameNode
        ) {
          return
        }

        if (!startsWithUppercase(defaultExportName)) {
          context.report({
            node: defaultExportNameNode,
            messageId: MESSAGE_IDS.COMPONENT_UPPERCASE,
            data: {
              name: defaultExportName
            }
          })
        }

        const fileName = getFileNameWithoutExtension(filePath)

        if (fileName !== defaultExportName) {
          context.report({
            node: defaultExportNameNode,
            messageId: MESSAGE_IDS.COMPONENT_FILENAME,
            data: {
              fileName,
              name: defaultExportName
            }
          })
        }
      }
    }
  }
}

const componentOnePerFileRule: RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require component files to contain only one component.'
    },
    schema: [],
    messages: {
      [MESSAGE_IDS.MULTIPLE_COMPONENTS]:
        'Component files must contain only one component.'
    }
  },
  create(context) {
    const componentDeclarations: Array<{ name: string; node: AstNode }> = []

    function registerComponentDeclaration(name: string, node: AstNode): void {
      if (startsWithUppercase(name)) {
        componentDeclarations.push({ name, node })
      }
    }

    return {
      FunctionDeclaration(node) {
        if (node.id?.type === 'Identifier') {
          registerComponentDeclaration(node.id.name, node.id)
        }
      },
      VariableDeclarator(node) {
        if (
          node.id.type !== 'Identifier' ||
          !node.init ||
          (node.init.type !== 'ArrowFunctionExpression' &&
            node.init.type !== 'FunctionExpression')
        ) {
          return
        }

        registerComponentDeclaration(node.id.name, node.id)
      },
      'Program:exit'() {
        if (!isLintableComponentFile(context)) {
          return
        }

        if (componentDeclarations.length > 1) {
          componentDeclarations.slice(1).forEach((componentDeclaration) => {
            context.report({
              node: componentDeclaration.node,
              messageId: MESSAGE_IDS.MULTIPLE_COMPONENTS
            })
          })
        }
      }
    }
  }
}

const componentRequireDefaultExportRule: RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require component files to have a default export.'
    },
    schema: [],
    messages: {
      [MESSAGE_IDS.MISSING_DEFAULT_EXPORT]:
        'Component files must have a default export.'
    }
  },
  create(context) {
    let hasDefaultExport = false

    return {
      ExportDefaultDeclaration() {
        hasDefaultExport = true
      },
      'Program:exit'(node) {
        if (!isLintableComponentFile(context) || hasDefaultExport) {
          return
        }

        context.report({
          node,
          messageId: MESSAGE_IDS.MISSING_DEFAULT_EXPORT
        })
      }
    }
  }
}

const componentDefaultExportFunctionDeclarationRule: RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Require default exports in component files to be function declarations.'
    },
    schema: [],
    messages: {
      [MESSAGE_IDS.DEFAULT_EXPORT_FUNCTION_DECLARATION]:
        'Default export must be a function declaration (arrow/function expression not allowed).'
    }
  },
  create(context) {
    const componentDeclarations: Array<{
      name: string
      node: AstNode
      kind: 'function-declaration' | 'arrow-function' | 'function-expression'
    }> = []
    let hasDefaultExport = false
    let defaultExportNode: AstNode | null = null
    let defaultExportKind:
      | 'function-declaration'
      | 'identifier'
      | 'other'
      | null = null
    let defaultExportName: string | null = null

    function registerComponentDeclaration(
      name: string,
      node: AstNode,
      kind: 'function-declaration' | 'arrow-function' | 'function-expression'
    ): void {
      if (startsWithUppercase(name)) {
        componentDeclarations.push({ name, node, kind })
      }
    }

    return {
      FunctionDeclaration(node) {
        if (node.id?.type === 'Identifier') {
          registerComponentDeclaration(
            node.id.name,
            node.id,
            'function-declaration'
          )
        }
      },
      VariableDeclarator(node) {
        if (
          node.id.type !== 'Identifier' ||
          !node.init ||
          (node.init.type !== 'ArrowFunctionExpression' &&
            node.init.type !== 'FunctionExpression')
        ) {
          return
        }

        registerComponentDeclaration(
          node.id.name,
          node.id,
          node.init.type === 'ArrowFunctionExpression'
            ? 'arrow-function'
            : 'function-expression'
        )
      },
      ExportDefaultDeclaration(node) {
        hasDefaultExport = true
        defaultExportNode = node.declaration

        if (
          node.declaration.type === 'FunctionDeclaration' &&
          node.declaration.id?.type === 'Identifier'
        ) {
          defaultExportKind = 'function-declaration'
          defaultExportName = node.declaration.id.name

          return
        }

        if (node.declaration.type === 'Identifier') {
          defaultExportKind = 'identifier'
          defaultExportName = node.declaration.name

          return
        }

        defaultExportKind = 'other'
      },
      'Program:exit'() {
        if (!isLintableComponentFile(context) || !hasDefaultExport) {
          return
        }

        if (defaultExportKind === 'function-declaration') {
          return
        }

        if (defaultExportKind === 'identifier' && defaultExportName) {
          const matchedDeclaration = componentDeclarations.find(
            (componentDeclaration) =>
              componentDeclaration.name === defaultExportName
          )

          if (matchedDeclaration?.kind === 'function-declaration') {
            return
          }
        }

        if (defaultExportNode) {
          context.report({
            node: defaultExportNode,
            messageId: MESSAGE_IDS.DEFAULT_EXPORT_FUNCTION_DECLARATION
          })
        }
      }
    }
  }
}

const componentPropsInterfaceRule: RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Require component files to define a local, non-exported interface named Props.'
    },
    schema: [],
    messages: {
      [MESSAGE_IDS.PROPS_INTERFACE_REQUIRED]:
        'Component files must define a local interface named "Props".',
      [MESSAGE_IDS.PROPS_INTERFACE_NAME]:
        'Component interface declarations must be named "Props".',
      [MESSAGE_IDS.PROPS_INTERFACE_EXPORTED]:
        'The "Props" interface must not be exported from component files.',
      [MESSAGE_IDS.PROPS_TYPE_ALIAS_FORBIDDEN]:
        'Use "interface Props" instead of a type alias for component props.',
      [MESSAGE_IDS.PROPS_INTERFACE_TOP_OF_FILE]:
        'The local "Props" interface must be declared before the component export.'
    }
  },
  create(context) {
    const lintableComponentFile = isLintableComponentFile(context)
    const functionDeclarations = new Map<string, AstNode>()
    const functionVariableDeclarations = new Map<string, AstNode>()
    const importedTypeNames = new Set<string>()
    let defaultExportNode: AstNode | null = null
    let defaultExportIdentifierName: string | null = null
    let localPropsInterfaceNode: AstNode | null = null
    const exportedPropsNodes: AstNode[] = []

    function registerFunctionDeclaration(node: AstNode): void {
      if (node.id?.type === 'Identifier') {
        functionDeclarations.set(node.id.name, node)
      }
    }

    return {
      ImportDeclaration(node) {
        if (!lintableComponentFile) {
          return
        }

        node.specifiers?.forEach((specifier: AstNode) => {
          if (specifier.local?.type === 'Identifier') {
            importedTypeNames.add(specifier.local.name)
          }
        })
      },
      TSInterfaceDeclaration(node) {
        if (!lintableComponentFile) {
          return
        }

        if (node.id?.type !== 'Identifier') {
          return
        }

        if (node.id.name === 'Props') {
          localPropsInterfaceNode = node

          return
        }

        context.report({
          node: node.id,
          messageId: MESSAGE_IDS.PROPS_INTERFACE_NAME
        })
      },
      TSTypeAliasDeclaration(node) {
        if (!lintableComponentFile) {
          return
        }

        if (node.id?.type === 'Identifier' && node.id.name === 'Props') {
          context.report({
            node: node.id,
            messageId: MESSAGE_IDS.PROPS_TYPE_ALIAS_FORBIDDEN
          })
        }
      },
      FunctionDeclaration(node) {
        if (!lintableComponentFile) {
          return
        }

        registerFunctionDeclaration(node)
      },
      VariableDeclarator(node) {
        if (!lintableComponentFile) {
          return
        }

        if (
          node.id.type === 'Identifier' &&
          node.init &&
          (node.init.type === 'ArrowFunctionExpression' ||
            node.init.type === 'FunctionExpression')
        ) {
          functionVariableDeclarations.set(node.id.name, node.init)
        }
      },
      ExportNamedDeclaration(node) {
        if (!lintableComponentFile) {
          return
        }

        if (
          node.declaration?.type === 'TSInterfaceDeclaration' &&
          node.declaration.id?.type === 'Identifier' &&
          node.declaration.id.name === 'Props'
        ) {
          exportedPropsNodes.push(node.declaration.id)
          localPropsInterfaceNode = node.declaration

          return
        }

        node.specifiers?.forEach((specifier: AstNode) => {
          if (
            specifier.type === 'ExportSpecifier' &&
            specifier.local?.type === 'Identifier' &&
            specifier.local.name === 'Props'
          ) {
            exportedPropsNodes.push(specifier.local)
          }
        })
      },
      ExportDefaultDeclaration(node) {
        if (!lintableComponentFile) {
          return
        }

        defaultExportNode = node.declaration

        if (node.declaration.type === 'Identifier') {
          defaultExportIdentifierName = node.declaration.name
        }
      },
      'Program:exit'(node) {
        if (!lintableComponentFile) {
          return
        }

        exportedPropsNodes.forEach((propsNode) => {
          context.report({
            node: propsNode,
            messageId: MESSAGE_IDS.PROPS_INTERFACE_EXPORTED
          })
        })

        let componentFunctionNode: AstNode | null = null

        if (defaultExportNode?.type === 'FunctionDeclaration') {
          componentFunctionNode = defaultExportNode
        } else if (defaultExportIdentifierName) {
          componentFunctionNode =
            functionDeclarations.get(defaultExportIdentifierName) ??
            functionVariableDeclarations.get(defaultExportIdentifierName) ??
            null
        }

        const hasPropsParameter = Boolean(componentFunctionNode?.params?.length)

        let usesExternalPropsInterface = false

        if (hasPropsParameter && componentFunctionNode) {
          const propsTypeAnnotation = getParameterTypeAnnotation(
            componentFunctionNode.params[0]
          )
          const unwrappedPropsType = unwrapTypeWrapper(propsTypeAnnotation)
          const propsTypeName =
            getTypeReferenceIdentifierName(unwrappedPropsType)

          if (propsTypeName && importedTypeNames.has(propsTypeName)) {
            usesExternalPropsInterface = true
          }
        }

        if (
          hasPropsParameter &&
          !localPropsInterfaceNode &&
          !usesExternalPropsInterface
        ) {
          context.report({
            node: defaultExportNode ?? node,
            messageId: MESSAGE_IDS.PROPS_INTERFACE_REQUIRED
          })

          return
        }

        if (
          defaultExportNode &&
          localPropsInterfaceNode &&
          typeof localPropsInterfaceNode.start === 'number' &&
          typeof defaultExportNode.start === 'number' &&
          localPropsInterfaceNode.start > defaultExportNode.start
        ) {
          context.report({
            node: localPropsInterfaceNode.id,
            messageId: MESSAGE_IDS.PROPS_INTERFACE_TOP_OF_FILE
          })
        }
      }
    }
  }
}

const componentFileExtensionRule: RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require files in the components folder to use .tsx.'
    },
    schema: [],
    messages: {
      [MESSAGE_IDS.COMPONENT_FILE_EXTENSION]:
        'Files in "/components/" must use ".tsx" (or ".jsx").'
    }
  },
  create(context) {
    return {
      'Program:exit'(node) {
        if (!isLintableComponentFolderFile(context)) {
          return
        }

        if (isComponentFile(getFilePath(context) ?? '')) {
          return
        }

        context.report({
          node,
          messageId: MESSAGE_IDS.COMPONENT_FILE_EXTENSION
        })
      }
    }
  }
}

const componentOutsideComponentsFolderRule: RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow component definitions outside the "/components/" folder.'
    },
    schema: [],
    messages: {
      [MESSAGE_IDS.COMPONENT_OUTSIDE_COMPONENTS_FOLDER]:
        'Component "{{name}}" must live inside the "/components/" folder.'
    }
  },
  create(context) {
    const componentDeclarations: Array<{ name: string; node: AstNode }> = []

    function registerComponentDeclaration(name: string, node: AstNode): void {
      if (startsWithUppercase(name)) {
        componentDeclarations.push({ name, node })
      }
    }

    return {
      FunctionDeclaration(node) {
        if (node.id?.type === 'Identifier') {
          registerComponentDeclaration(node.id.name, node.id)
        }
      },
      VariableDeclarator(node) {
        if (
          node.id.type !== 'Identifier' ||
          !node.init ||
          (node.init.type !== 'ArrowFunctionExpression' &&
            node.init.type !== 'FunctionExpression')
        ) {
          return
        }

        registerComponentDeclaration(node.id.name, node.id)
      },
      'Program:exit'() {
        const filePath = getFilePath(context)

        if (!filePath || filePath === '<input>') {
          return
        }

        if (isComponentFolderFile(filePath)) {
          return
        }

        componentDeclarations.forEach(({ name, node }) => {
          context.report({
            node,
            messageId: MESSAGE_IDS.COMPONENT_OUTSIDE_COMPONENTS_FOLDER,
            data: {
              name
            }
          })
        })
      }
    }
  }
}

const COMPONENT_RULES = {
  componentNamingConventionRule,
  componentOnePerFileRule,
  componentRequireDefaultExportRule,
  componentDefaultExportFunctionDeclarationRule,
  componentPropsInterfaceRule,
  componentFileExtensionRule,
  componentOutsideComponentsFolderRule
}

export default COMPONENT_RULES
