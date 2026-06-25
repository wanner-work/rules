const MESSAGE_IDS = {
  COMPONENT_UPPERCASE: 'componentNameMustStartUppercase',
  COMPONENT_FILENAME: 'fileNameMustMatchComponentName',
  MULTIPLE_COMPONENTS: 'oneComponentPerFile',
  MISSING_DEFAULT_EXPORT: 'componentMustHaveDefaultExport',
  DEFAULT_EXPORT_FUNCTION_DECLARATION: 'defaultExportMustBeFunctionDeclaration',
  PROPS_INTERFACE_REQUIRED: 'propsInterfaceRequired',
  PROPS_INTERFACE_NAME: 'propsInterfaceMustBeNamedProps',
  PROPS_INTERFACE_EXPORTED: 'propsInterfaceMustBeLocal',
  PROPS_TYPE_ALIAS_FORBIDDEN: 'propsMustBeInterface',
  PROPS_INTERFACE_TOP_OF_FILE: 'propsInterfaceMustBeAtTop',
  COMPONENT_FILE_EXTENSION: 'componentFileMustUseTsx',
  COMPONENT_OUTSIDE_COMPONENTS_FOLDER:
    'componentMustLiveInComponentsFolder',
  INTERFACE_NAME_PASCAL_CASE: 'interfaceNameMustBePascalCase',
  INTERFACE_FILENAME: 'interfaceFileNameMustMatchInterfaceName',
  INTERFACE_ONE_PER_FILE: 'oneInterfacePerFile',
  INTERFACE_DEFAULT_EXPORT: 'interfaceMustBeDefaultExport',
  INTERFACE_NO_I_PREFIX: 'interfaceMustNotUseIPrefix',
  METHOD_NAME_CAMEL_CASE: 'methodNameMustBeCamelCase',
  METHOD_ONE_PER_FILE: 'oneMethodPerFile',
  METHOD_DEFAULT_EXPORT: 'methodMustBeDefaultExport',
  METHOD_OPTIONS_INTERFACE_LOCATION:
    'methodOptionsInterfaceMustBeLocalOrFromTypes',
  METHOD_OPTIONS_INTERFACE_USAGE: 'methodOptionsUsageMustResolveToLocalOrTypes',
  METHOD_OUTSIDE_COMPONENTS_DECLARATION:
    'methodOutsideComponentsMustUseFunctionDeclaration',
  METHOD_INSIDE_COMPONENTS_ARROW: 'methodInsideComponentsMustUseArrowFunction',
  CONSTANT_NAME_UPPERCASE_SNAKE_CASE: 'constantNameMustBeUppercaseSnakeCase',
  CONSTANT_FILENAME: 'constantFileNameMustMatchConstantName',
  CONSTANT_SINGLE_OBJECT: 'constantsMustBeGroupedInSingleObject',
  CONSTANT_DEFAULT_EXPORT: 'constantsObjectMustBeDefaultExported',
  HOOK_NAME_PREFIX: 'hookNameMustStartWithUse',
  HOOK_FILENAME: 'hookFileNameMustMatchHookName',
  HOOK_ONE_PER_FILE: 'oneHookPerFile',
  HOOK_DEFAULT_EXPORT: 'hookMustBeDefaultExport',
  HOOK_DEFAULT_EXPORT_DECLARATION:
    'hookDefaultExportMustBeNamedFunctionDeclaration',
  HOOK_OPTIONS_INTERFACE_LOCATION: 'hookOptionsInterfaceMustBeLocalOrFromTypes',
  HOOK_OPTIONS_INTERFACE_USAGE: 'hookOptionsUsageMustResolveToLocalOrTypes'
}

export default MESSAGE_IDS
