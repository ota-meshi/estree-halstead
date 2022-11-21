import type { TSESTree, AST_NODE_TYPES } from "@typescript-eslint/types";
export type Visitor = {
  ArrayExpression?: (
    node: TSESTree.ArrayExpression,
    parent: TSESTree.Node | null
  ) => void;
  ArrayPattern?: (
    node: TSESTree.ArrayPattern,
    parent: TSESTree.Node | null
  ) => void;
  ArrowFunctionExpression?: (
    node: TSESTree.ArrowFunctionExpression,
    parent: TSESTree.Node | null
  ) => void;
  AssignmentExpression?: (
    node: TSESTree.AssignmentExpression,
    parent: TSESTree.Node | null
  ) => void;
  AssignmentPattern?: (
    node: TSESTree.AssignmentPattern,
    parent: TSESTree.Node | null
  ) => void;
  AwaitExpression?: (
    node: TSESTree.AwaitExpression,
    parent: TSESTree.Node | null
  ) => void;
  BinaryExpression?: (
    node: TSESTree.BinaryExpression,
    parent: TSESTree.Node | null
  ) => void;
  BlockStatement?: (
    node: TSESTree.BlockStatement,
    parent: TSESTree.Node | null
  ) => void;
  BreakStatement?: (
    node: TSESTree.BreakStatement,
    parent: TSESTree.Node | null
  ) => void;
  CallExpression?: (
    node: TSESTree.CallExpression,
    parent: TSESTree.Node | null
  ) => void;
  CatchClause?: (
    node: TSESTree.CatchClause,
    parent: TSESTree.Node | null
  ) => void;
  ChainExpression?: (
    node: TSESTree.ChainExpression,
    parent: TSESTree.Node | null
  ) => void;
  ClassBody?: (node: TSESTree.ClassBody, parent: TSESTree.Node | null) => void;
  ClassDeclaration?: (
    node: TSESTree.ClassDeclaration,
    parent: TSESTree.Node | null
  ) => void;
  ClassExpression?: (
    node: TSESTree.ClassExpression,
    parent: TSESTree.Node | null
  ) => void;
  ConditionalExpression?: (
    node: TSESTree.ConditionalExpression,
    parent: TSESTree.Node | null
  ) => void;
  ContinueStatement?: (
    node: TSESTree.ContinueStatement,
    parent: TSESTree.Node | null
  ) => void;
  DebuggerStatement?: (
    node: TSESTree.DebuggerStatement,
    parent: TSESTree.Node | null
  ) => void;
  Decorator?: (node: TSESTree.Decorator, parent: TSESTree.Node | null) => void;
  DoWhileStatement?: (
    node: TSESTree.DoWhileStatement,
    parent: TSESTree.Node | null
  ) => void;
  EmptyStatement?: (
    node: TSESTree.EmptyStatement,
    parent: TSESTree.Node | null
  ) => void;
  ExportAllDeclaration?: (
    node: TSESTree.ExportAllDeclaration,
    parent: TSESTree.Node | null
  ) => void;
  ExportDefaultDeclaration?: (
    node: TSESTree.ExportDefaultDeclaration,
    parent: TSESTree.Node | null
  ) => void;
  ExportNamedDeclaration?: (
    node: TSESTree.ExportNamedDeclaration,
    parent: TSESTree.Node | null
  ) => void;
  ExportSpecifier?: (
    node: TSESTree.ExportSpecifier,
    parent: TSESTree.Node | null
  ) => void;
  ExpressionStatement?: (
    node: TSESTree.ExpressionStatement,
    parent: TSESTree.Node | null
  ) => void;
  ForInStatement?: (
    node: TSESTree.ForInStatement,
    parent: TSESTree.Node | null
  ) => void;
  ForOfStatement?: (
    node: TSESTree.ForOfStatement,
    parent: TSESTree.Node | null
  ) => void;
  ForStatement?: (
    node: TSESTree.ForStatement,
    parent: TSESTree.Node | null
  ) => void;
  FunctionDeclaration?: (
    node: TSESTree.FunctionDeclaration,
    parent: TSESTree.Node | null
  ) => void;
  FunctionExpression?: (
    node: TSESTree.FunctionExpression,
    parent: TSESTree.Node | null
  ) => void;
  Identifier?: (
    node: TSESTree.Identifier,
    parent: TSESTree.Node | null
  ) => void;
  IfStatement?: (
    node: TSESTree.IfStatement,
    parent: TSESTree.Node | null
  ) => void;
  ImportAttribute?: (
    node: TSESTree.ImportAttribute,
    parent: TSESTree.Node | null
  ) => void;
  ImportDeclaration?: (
    node: TSESTree.ImportDeclaration,
    parent: TSESTree.Node | null
  ) => void;
  ImportDefaultSpecifier?: (
    node: TSESTree.ImportDefaultSpecifier,
    parent: TSESTree.Node | null
  ) => void;
  ImportExpression?: (
    node: TSESTree.ImportExpression,
    parent: TSESTree.Node | null
  ) => void;
  ImportNamespaceSpecifier?: (
    node: TSESTree.ImportNamespaceSpecifier,
    parent: TSESTree.Node | null
  ) => void;
  ImportSpecifier?: (
    node: TSESTree.ImportSpecifier,
    parent: TSESTree.Node | null
  ) => void;
  JSXAttribute?: (
    node: TSESTree.JSXAttribute,
    parent: TSESTree.Node | null
  ) => void;
  JSXClosingElement?: (
    node: TSESTree.JSXClosingElement,
    parent: TSESTree.Node | null
  ) => void;
  JSXClosingFragment?: (
    node: TSESTree.JSXClosingFragment,
    parent: TSESTree.Node | null
  ) => void;
  JSXElement?: (
    node: TSESTree.JSXElement,
    parent: TSESTree.Node | null
  ) => void;
  JSXEmptyExpression?: (
    node: TSESTree.JSXEmptyExpression,
    parent: TSESTree.Node | null
  ) => void;
  JSXExpressionContainer?: (
    node: TSESTree.JSXExpressionContainer,
    parent: TSESTree.Node | null
  ) => void;
  JSXFragment?: (
    node: TSESTree.JSXFragment,
    parent: TSESTree.Node | null
  ) => void;
  JSXIdentifier?: (
    node: TSESTree.JSXIdentifier,
    parent: TSESTree.Node | null
  ) => void;
  JSXMemberExpression?: (
    node: TSESTree.JSXMemberExpression,
    parent: TSESTree.Node | null
  ) => void;
  JSXNamespacedName?: (
    node: TSESTree.JSXNamespacedName,
    parent: TSESTree.Node | null
  ) => void;
  JSXOpeningElement?: (
    node: TSESTree.JSXOpeningElement,
    parent: TSESTree.Node | null
  ) => void;
  JSXOpeningFragment?: (
    node: TSESTree.JSXOpeningFragment,
    parent: TSESTree.Node | null
  ) => void;
  JSXSpreadAttribute?: (
    node: TSESTree.JSXSpreadAttribute,
    parent: TSESTree.Node | null
  ) => void;
  JSXSpreadChild?: (
    node: TSESTree.JSXSpreadChild,
    parent: TSESTree.Node | null
  ) => void;
  JSXText?: (node: TSESTree.JSXText, parent: TSESTree.Node | null) => void;
  LabeledStatement?: (
    node: TSESTree.LabeledStatement,
    parent: TSESTree.Node | null
  ) => void;
  Literal?: (node: TSESTree.Literal, parent: TSESTree.Node | null) => void;
  LogicalExpression?: (
    node: TSESTree.LogicalExpression,
    parent: TSESTree.Node | null
  ) => void;
  MemberExpression?: (
    node: TSESTree.MemberExpression,
    parent: TSESTree.Node | null
  ) => void;
  MetaProperty?: (
    node: TSESTree.MetaProperty,
    parent: TSESTree.Node | null
  ) => void;
  MethodDefinition?: (
    node: TSESTree.MethodDefinition,
    parent: TSESTree.Node | null
  ) => void;
  NewExpression?: (
    node: TSESTree.NewExpression,
    parent: TSESTree.Node | null
  ) => void;
  ObjectExpression?: (
    node: TSESTree.ObjectExpression,
    parent: TSESTree.Node | null
  ) => void;
  ObjectPattern?: (
    node: TSESTree.ObjectPattern,
    parent: TSESTree.Node | null
  ) => void;
  PrivateIdentifier?: (
    node: TSESTree.PrivateIdentifier,
    parent: TSESTree.Node | null
  ) => void;
  Program?: (node: TSESTree.Program, parent: TSESTree.Node | null) => void;
  Property?: (node: TSESTree.Property, parent: TSESTree.Node | null) => void;
  PropertyDefinition?: (
    node: TSESTree.PropertyDefinition,
    parent: TSESTree.Node | null
  ) => void;
  RestElement?: (
    node: TSESTree.RestElement,
    parent: TSESTree.Node | null
  ) => void;
  ReturnStatement?: (
    node: TSESTree.ReturnStatement,
    parent: TSESTree.Node | null
  ) => void;
  SequenceExpression?: (
    node: TSESTree.SequenceExpression,
    parent: TSESTree.Node | null
  ) => void;
  SpreadElement?: (
    node: TSESTree.SpreadElement,
    parent: TSESTree.Node | null
  ) => void;
  StaticBlock?: (
    node: TSESTree.StaticBlock,
    parent: TSESTree.Node | null
  ) => void;
  Super?: (node: TSESTree.Super, parent: TSESTree.Node | null) => void;
  SwitchCase?: (
    node: TSESTree.SwitchCase,
    parent: TSESTree.Node | null
  ) => void;
  SwitchStatement?: (
    node: TSESTree.SwitchStatement,
    parent: TSESTree.Node | null
  ) => void;
  TaggedTemplateExpression?: (
    node: TSESTree.TaggedTemplateExpression,
    parent: TSESTree.Node | null
  ) => void;
  TemplateElement?: (
    node: TSESTree.TemplateElement,
    parent: TSESTree.Node | null
  ) => void;
  TemplateLiteral?: (
    node: TSESTree.TemplateLiteral,
    parent: TSESTree.Node | null
  ) => void;
  ThisExpression?: (
    node: TSESTree.ThisExpression,
    parent: TSESTree.Node | null
  ) => void;
  ThrowStatement?: (
    node: TSESTree.ThrowStatement,
    parent: TSESTree.Node | null
  ) => void;
  TryStatement?: (
    node: TSESTree.TryStatement,
    parent: TSESTree.Node | null
  ) => void;
  UnaryExpression?: (
    node: TSESTree.UnaryExpression,
    parent: TSESTree.Node | null
  ) => void;
  UpdateExpression?: (
    node: TSESTree.UpdateExpression,
    parent: TSESTree.Node | null
  ) => void;
  VariableDeclaration?: (
    node: TSESTree.VariableDeclaration,
    parent: TSESTree.Node | null
  ) => void;
  VariableDeclarator?: (
    node: TSESTree.VariableDeclarator,
    parent: TSESTree.Node | null
  ) => void;
  WhileStatement?: (
    node: TSESTree.WhileStatement,
    parent: TSESTree.Node | null
  ) => void;
  WithStatement?: (
    node: TSESTree.WithStatement,
    parent: TSESTree.Node | null
  ) => void;
  YieldExpression?: (
    node: TSESTree.YieldExpression,
    parent: TSESTree.Node | null
  ) => void;
  TSAbstractKeyword?: (
    node: TSESTree.TSAbstractKeyword,
    parent: TSESTree.Node | null
  ) => void;
  TSAbstractMethodDefinition?: (
    node: TSESTree.TSAbstractMethodDefinition,
    parent: TSESTree.Node | null
  ) => void;
  TSAbstractPropertyDefinition?: (
    node: TSESTree.TSAbstractPropertyDefinition,
    parent: TSESTree.Node | null
  ) => void;
  TSAnyKeyword?: (
    node: TSESTree.TSAnyKeyword,
    parent: TSESTree.Node | null
  ) => void;
  TSArrayType?: (
    node: TSESTree.TSArrayType,
    parent: TSESTree.Node | null
  ) => void;
  TSAsExpression?: (
    node: TSESTree.TSAsExpression,
    parent: TSESTree.Node | null
  ) => void;
  TSAsyncKeyword?: (
    node: TSESTree.TSAsyncKeyword,
    parent: TSESTree.Node | null
  ) => void;
  TSBigIntKeyword?: (
    node: TSESTree.TSBigIntKeyword,
    parent: TSESTree.Node | null
  ) => void;
  TSBooleanKeyword?: (
    node: TSESTree.TSBooleanKeyword,
    parent: TSESTree.Node | null
  ) => void;
  TSCallSignatureDeclaration?: (
    node: TSESTree.TSCallSignatureDeclaration,
    parent: TSESTree.Node | null
  ) => void;
  TSClassImplements?: (
    node: TSESTree.TSClassImplements,
    parent: TSESTree.Node | null
  ) => void;
  TSConditionalType?: (
    node: TSESTree.TSConditionalType,
    parent: TSESTree.Node | null
  ) => void;
  TSConstructorType?: (
    node: TSESTree.TSConstructorType,
    parent: TSESTree.Node | null
  ) => void;
  TSConstructSignatureDeclaration?: (
    node: TSESTree.TSConstructSignatureDeclaration,
    parent: TSESTree.Node | null
  ) => void;
  TSDeclareFunction?: (
    node: TSESTree.TSDeclareFunction,
    parent: TSESTree.Node | null
  ) => void;
  TSDeclareKeyword?: (
    node: TSESTree.TSDeclareKeyword,
    parent: TSESTree.Node | null
  ) => void;
  TSEmptyBodyFunctionExpression?: (
    node: TSESTree.TSEmptyBodyFunctionExpression,
    parent: TSESTree.Node | null
  ) => void;
  TSEnumDeclaration?: (
    node: TSESTree.TSEnumDeclaration,
    parent: TSESTree.Node | null
  ) => void;
  TSEnumMember?: (
    node: TSESTree.TSEnumMember,
    parent: TSESTree.Node | null
  ) => void;
  TSExportAssignment?: (
    node: TSESTree.TSExportAssignment,
    parent: TSESTree.Node | null
  ) => void;
  TSExportKeyword?: (
    node: TSESTree.TSExportKeyword,
    parent: TSESTree.Node | null
  ) => void;
  TSExternalModuleReference?: (
    node: TSESTree.TSExternalModuleReference,
    parent: TSESTree.Node | null
  ) => void;
  TSFunctionType?: (
    node: TSESTree.TSFunctionType,
    parent: TSESTree.Node | null
  ) => void;
  TSInstantiationExpression?: (
    node: TSESTree.TSInstantiationExpression,
    parent: TSESTree.Node | null
  ) => void;
  TSImportEqualsDeclaration?: (
    node: TSESTree.TSImportEqualsDeclaration,
    parent: TSESTree.Node | null
  ) => void;
  TSImportType?: (
    node: TSESTree.TSImportType,
    parent: TSESTree.Node | null
  ) => void;
  TSIndexedAccessType?: (
    node: TSESTree.TSIndexedAccessType,
    parent: TSESTree.Node | null
  ) => void;
  TSIndexSignature?: (
    node: TSESTree.TSIndexSignature,
    parent: TSESTree.Node | null
  ) => void;
  TSInferType?: (
    node: TSESTree.TSInferType,
    parent: TSESTree.Node | null
  ) => void;
  TSInterfaceBody?: (
    node: TSESTree.TSInterfaceBody,
    parent: TSESTree.Node | null
  ) => void;
  TSInterfaceDeclaration?: (
    node: TSESTree.TSInterfaceDeclaration,
    parent: TSESTree.Node | null
  ) => void;
  TSInterfaceHeritage?: (
    node: TSESTree.TSInterfaceHeritage,
    parent: TSESTree.Node | null
  ) => void;
  TSIntersectionType?: (
    node: TSESTree.TSIntersectionType,
    parent: TSESTree.Node | null
  ) => void;
  TSIntrinsicKeyword?: (
    node: TSESTree.Node & { type: AST_NODE_TYPES.TSIntrinsicKeyword },
    parent: TSESTree.Node | null
  ) => void;
  TSLiteralType?: (
    node: TSESTree.TSLiteralType,
    parent: TSESTree.Node | null
  ) => void;
  TSMappedType?: (
    node: TSESTree.TSMappedType,
    parent: TSESTree.Node | null
  ) => void;
  TSMethodSignature?: (
    node: TSESTree.TSMethodSignature,
    parent: TSESTree.Node | null
  ) => void;
  TSModuleBlock?: (
    node: TSESTree.TSModuleBlock,
    parent: TSESTree.Node | null
  ) => void;
  TSModuleDeclaration?: (
    node: TSESTree.TSModuleDeclaration,
    parent: TSESTree.Node | null
  ) => void;
  TSNamedTupleMember?: (
    node: TSESTree.TSNamedTupleMember,
    parent: TSESTree.Node | null
  ) => void;
  TSNamespaceExportDeclaration?: (
    node: TSESTree.TSNamespaceExportDeclaration,
    parent: TSESTree.Node | null
  ) => void;
  TSNeverKeyword?: (
    node: TSESTree.TSNeverKeyword,
    parent: TSESTree.Node | null
  ) => void;
  TSNonNullExpression?: (
    node: TSESTree.TSNonNullExpression,
    parent: TSESTree.Node | null
  ) => void;
  TSNullKeyword?: (
    node: TSESTree.TSNullKeyword,
    parent: TSESTree.Node | null
  ) => void;
  TSNumberKeyword?: (
    node: TSESTree.TSNumberKeyword,
    parent: TSESTree.Node | null
  ) => void;
  TSObjectKeyword?: (
    node: TSESTree.TSObjectKeyword,
    parent: TSESTree.Node | null
  ) => void;
  TSOptionalType?: (
    node: TSESTree.TSOptionalType,
    parent: TSESTree.Node | null
  ) => void;
  TSParameterProperty?: (
    node: TSESTree.TSParameterProperty,
    parent: TSESTree.Node | null
  ) => void;
  TSPrivateKeyword?: (
    node: TSESTree.TSPrivateKeyword,
    parent: TSESTree.Node | null
  ) => void;
  TSPropertySignature?: (
    node: TSESTree.TSPropertySignature,
    parent: TSESTree.Node | null
  ) => void;
  TSProtectedKeyword?: (
    node: TSESTree.TSProtectedKeyword,
    parent: TSESTree.Node | null
  ) => void;
  TSPublicKeyword?: (
    node: TSESTree.TSPublicKeyword,
    parent: TSESTree.Node | null
  ) => void;
  TSQualifiedName?: (
    node: TSESTree.TSQualifiedName,
    parent: TSESTree.Node | null
  ) => void;
  TSReadonlyKeyword?: (
    node: TSESTree.TSReadonlyKeyword,
    parent: TSESTree.Node | null
  ) => void;
  TSRestType?: (
    node: TSESTree.TSRestType,
    parent: TSESTree.Node | null
  ) => void;
  TSSatisfiesExpression?: (
    node: TSESTree.TSSatisfiesExpression,
    parent: TSESTree.Node | null
  ) => void;
  TSStaticKeyword?: (
    node: TSESTree.TSStaticKeyword,
    parent: TSESTree.Node | null
  ) => void;
  TSStringKeyword?: (
    node: TSESTree.TSStringKeyword,
    parent: TSESTree.Node | null
  ) => void;
  TSSymbolKeyword?: (
    node: TSESTree.TSSymbolKeyword,
    parent: TSESTree.Node | null
  ) => void;
  TSTemplateLiteralType?: (
    node: TSESTree.TSTemplateLiteralType,
    parent: TSESTree.Node | null
  ) => void;
  TSThisType?: (
    node: TSESTree.TSThisType,
    parent: TSESTree.Node | null
  ) => void;
  TSTupleType?: (
    node: TSESTree.TSTupleType,
    parent: TSESTree.Node | null
  ) => void;
  TSTypeAliasDeclaration?: (
    node: TSESTree.TSTypeAliasDeclaration,
    parent: TSESTree.Node | null
  ) => void;
  TSTypeAnnotation?: (
    node: TSESTree.TSTypeAnnotation,
    parent: TSESTree.Node | null
  ) => void;
  TSTypeAssertion?: (
    node: TSESTree.TSTypeAssertion,
    parent: TSESTree.Node | null
  ) => void;
  TSTypeLiteral?: (
    node: TSESTree.TSTypeLiteral,
    parent: TSESTree.Node | null
  ) => void;
  TSTypeOperator?: (
    node: TSESTree.TSTypeOperator,
    parent: TSESTree.Node | null
  ) => void;
  TSTypeParameter?: (
    node: TSESTree.TSTypeParameter,
    parent: TSESTree.Node | null
  ) => void;
  TSTypeParameterDeclaration?: (
    node: TSESTree.TSTypeParameterDeclaration,
    parent: TSESTree.Node | null
  ) => void;
  TSTypeParameterInstantiation?: (
    node: TSESTree.TSTypeParameterInstantiation,
    parent: TSESTree.Node | null
  ) => void;
  TSTypePredicate?: (
    node: TSESTree.TSTypePredicate,
    parent: TSESTree.Node | null
  ) => void;
  TSTypeQuery?: (
    node: TSESTree.TSTypeQuery,
    parent: TSESTree.Node | null
  ) => void;
  TSTypeReference?: (
    node: TSESTree.TSTypeReference,
    parent: TSESTree.Node | null
  ) => void;
  TSUndefinedKeyword?: (
    node: TSESTree.TSUndefinedKeyword,
    parent: TSESTree.Node | null
  ) => void;
  TSUnionType?: (
    node: TSESTree.TSUnionType,
    parent: TSESTree.Node | null
  ) => void;
  TSUnknownKeyword?: (
    node: TSESTree.TSUnknownKeyword,
    parent: TSESTree.Node | null
  ) => void;
  TSVoidKeyword?: (
    node: TSESTree.TSVoidKeyword,
    parent: TSESTree.Node | null
  ) => void;
};
