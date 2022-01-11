import { AST_NODE_TYPES } from "@typescript-eslint/types"
import type { TSESTree } from "@typescript-eslint/types"
import type * as ESTree from "estree"
import { walk } from "./walker"
import type { Visitor } from "./visitor"

type AllVisitor = Required<Visitor>
type Operator =
    | TSESTree.AssignmentExpression["operator"]
    | ESTree.BinaryExpression["operator"]
    | TSESTree.LogicalExpression["operator"]
    | TSESTree.UnaryExpression["operator"]
    | TSESTree.UpdateExpression["operator"]
    | TSESTree.VariableDeclaration["kind"]
    | "()"
    | "[]"
    | "{}"
    | ","
    | "."
    | "=>"
    | "?."
    | "?:"
    | "@"
    | ";"
    | ":"
    | "..."
    | "</" // JSXClosingElement, JSXClosingFragment
    | "async"
    | "await"
    | "break"
    | "catch"
    | "class"
    | "extends"
    | "continue"
    | "debugger"
    | "do"
    | "while()"
    | "export"
    | "type"
    | "as"
    | "default"
    | "for()"
    | "of"
    | "function"
    | "if()"
    | "else"
    | "import"
    | "from"
    | "assert"
    | "static"
    | "get"
    | "set"
    | "new"
    | "return"
    | "case"
    | "switch()"
    | "throw"
    | "try"
    | "finally"
    | "with()"
    | "yield"
    // TS
    | "?"
    | "<>"
    | "private"
    | "protected"
    | "public"
    | "implements"
    | "abstract"
    | "declare"
    | "enum"
    | "infer"
    | "interface"
    | "readonly"
    | "module"
    | "namespace"
    | "keyof"
    | "is"

export type ExtractTokensResult = {
    readonly operators: TokensCollection<string>
    readonly operands: TokensCollection<string>
}
export class TokensCollection<T> {
    private readonly total: T[] = []

    private readonly distinct = new Set<T>()

    public add(e: T, count = 1): void {
        if (count === 1) {
            this.total.push(e)
            this.distinct.add(e)
        } else {
            for (let index = 0; index < count; index++) {
                this.total.push(e)
                this.distinct.add(e)
            }
        }
    }

    public get all(): T[] {
        return this.total
    }

    public get distinctSize(): number {
        return this.distinct.size
    }

    public get totalSize(): number {
        return this.total.length
    }
}
class ExtractTokensContext implements ExtractTokensResult {
    public readonly operators = new TokensCollection<Operator>()

    public readonly operands = new TokensCollection<string>()
}

/** noop */
function noop(): void {
    /* noop */
}

/**
 * Get operator precedence
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
 */
function getPrecedence(node: TSESTree.Expression): number {
    if (node.type === AST_NODE_TYPES.SequenceExpression) {
        return 1
    }
    if (
        node.type === AST_NODE_TYPES.YieldExpression ||
        node.type === AST_NODE_TYPES.AssignmentExpression
    ) {
        return 2
    }
    if (node.type === AST_NODE_TYPES.ConditionalExpression) {
        return 3
    }
    if (node.type === AST_NODE_TYPES.LogicalExpression) {
        if (node.operator === "||" || node.operator === "??") {
            return 4
        }
        if (node.operator === "&&") {
            return 5
        }
        throw new Error(`Unknown operator precedence:${node.operator}`)
    }
    if (node.type === AST_NODE_TYPES.BinaryExpression) {
        if (node.operator === "|") {
            return 6
        }
        if (node.operator === "^") {
            return 7
        }
        if (node.operator === "&") {
            return 8
        }
        if (
            node.operator === "==" ||
            node.operator === "!=" ||
            node.operator === "===" ||
            node.operator === "!=="
        ) {
            return 9
        }
        if (
            node.operator === "<" ||
            node.operator === "<=" ||
            node.operator === ">" ||
            node.operator === ">=" ||
            node.operator === "in" ||
            node.operator === "instanceof"
        ) {
            return 10
        }
        if (
            node.operator === "<<" ||
            node.operator === ">>" ||
            node.operator === ">>>"
        ) {
            return 11
        }
        if (node.operator === "+" || node.operator === "-") {
            return 12
        }
        if (
            node.operator === "*" ||
            node.operator === "/" ||
            node.operator === "%"
        ) {
            return 13
        }
        if (node.operator === "**") {
            return 14
        }
        throw new Error(`Unknown operator precedence:${node.operator}`)
    }
    if (
        node.type === AST_NODE_TYPES.UnaryExpression ||
        node.type === AST_NODE_TYPES.AwaitExpression
    ) {
        return 15
    }
    if (node.type === AST_NODE_TYPES.UpdateExpression) {
        if (node.prefix) {
            return 15
        }
        return 16
    }
    if (
        node.type === AST_NODE_TYPES.NewExpression ||
        node.type === AST_NODE_TYPES.CallExpression ||
        node.type === AST_NODE_TYPES.ImportExpression ||
        node.type === AST_NODE_TYPES.ChainExpression
    ) {
        return 18
    }
    if (node.type === AST_NODE_TYPES.MemberExpression) {
        return 19
    }

    // Others
    if (node.type === AST_NODE_TYPES.ArrowFunctionExpression) {
        return 2
    }
    if (node.type === AST_NODE_TYPES.TSAsExpression) {
        return 14.5
    }
    return Infinity
}

const EXTRACT_TOKENS: AllVisitor = {
    ArrayExpression(
        this: ExtractTokensContext,
        node: TSESTree.ArrayExpression,
    ) {
        this.operators.add("[]")
        this.operators.add(",", node.elements.length - 1)
    },
    ArrayPattern(this: ExtractTokensContext, node: TSESTree.ArrayPattern) {
        this.operators.add("[]")
        this.operators.add(",", node.elements.length - 1)
    },
    ArrowFunctionExpression(
        this: ExtractTokensContext,
        node: TSESTree.ArrowFunctionExpression,
    ) {
        if (node.async) {
            this.operators.add("async")
        }
        if (node.generator) {
            // It cannot actually be used.
            this.operators.add("*")
        }
        if (
            node.params.length !== 1 ||
            node.params[0].type !== AST_NODE_TYPES.Identifier ||
            node.params[0].typeAnnotation
        ) {
            this.operators.add("()")
        }
        this.operators.add(",", node.params.length - 1)

        this.operators.add("=>")

        if (node.body.type === AST_NODE_TYPES.ObjectExpression) {
            this.operators.add("()")
        }
    },
    AssignmentExpression(
        this: ExtractTokensContext,
        node: TSESTree.AssignmentExpression,
    ) {
        this.operators.add(node.operator)

        if (getPrecedence(node) >= getPrecedence(node.right)) {
            this.operators.add("()")
        }
    },
    AssignmentPattern(
        this: ExtractTokensContext,
        _node: TSESTree.AssignmentPattern,
    ) {
        this.operators.add("=")
    },
    AwaitExpression(
        this: ExtractTokensContext,
        node: TSESTree.AwaitExpression,
    ) {
        this.operators.add("await")

        if (getPrecedence(node) > getPrecedence(node.argument)) {
            this.operators.add("()")
        }
    },
    BinaryExpression(
        this: ExtractTokensContext,
        node: TSESTree.BinaryExpression,
    ) {
        this.operators.add(node.operator as ESTree.BinaryExpression["operator"])

        if (getPrecedence(node) >= getPrecedence(node.right)) {
            this.operators.add("()")
        }
    },
    BlockStatement(this: ExtractTokensContext) {
        this.operators.add("{}")
    },
    BreakStatement(this: ExtractTokensContext) {
        this.operators.add("break")
    },
    CallExpression(this: ExtractTokensContext, node: TSESTree.CallExpression) {
        if (node.optional) {
            this.operators.add("?.")
        }
        this.operators.add("()")
        this.operators.add(",", node.arguments.length - 1)
    },
    CatchClause(this: ExtractTokensContext, node: TSESTree.CatchClause) {
        this.operators.add("catch")
        if (node.param) {
            this.operators.add("()")
        }
    },
    ChainExpression: noop,
    ClassBody(this: ExtractTokensContext) {
        this.operators.add("{}")
    },
    ClassDeclaration(
        this: ExtractTokensContext,
        node: TSESTree.ClassDeclaration,
    ) {
        this.operators.add("class")
        if (node.superClass) {
            this.operators.add("extends")
        }
        if (node.implements) {
            this.operators.add("implements")
            this.operators.add(",", node.implements.length - 1)
        }
        if (node.abstract) {
            this.operators.add("abstract")
        }
        if (node.declare) this.operators.add("declare")
    },
    ClassExpression(
        this: ExtractTokensContext,
        node: TSESTree.ClassExpression,
    ) {
        this.operators.add("class")
        if (node.superClass) {
            this.operators.add("extends")
        }
        if (node.implements) {
            this.operators.add("implements")
        }
        if (node.abstract) {
            this.operators.add("abstract")
        }
        if (node.declare) this.operators.add("declare")
    },
    ConditionalExpression(
        this: ExtractTokensContext,
        node: TSESTree.ConditionalExpression,
    ) {
        if (getPrecedence(node) >= getPrecedence(node.test)) {
            this.operators.add("()")
        }
        this.operators.add("?:")
    },
    ContinueStatement(this: ExtractTokensContext) {
        this.operators.add("continue")
    },
    DebuggerStatement(this: ExtractTokensContext) {
        this.operators.add("debugger")
    },
    Decorator(this: ExtractTokensContext) {
        this.operators.add("@")
    },
    DoWhileStatement(this: ExtractTokensContext) {
        this.operators.add("do")
        this.operators.add("while()")
    },
    EmptyStatement(this: ExtractTokensContext) {
        this.operators.add(";")
    },
    ExportAllDeclaration(
        this: ExtractTokensContext,
        node: TSESTree.ExportAllDeclaration,
    ) {
        this.operators.add("export")
        if (node.exportKind === "type") {
            this.operators.add("type")
        }
        this.operators.add("*")
        if (node.exported) {
            this.operators.add("as")
        }
        if (node.source) {
            this.operators.add("from")
        }
        if (node.assertions && node.assertions.length) {
            this.operators.add("assert")
            this.operators.add("{}")
        }
    },
    ExportDefaultDeclaration(
        this: ExtractTokensContext,
        node: TSESTree.ExportDefaultDeclaration,
    ) {
        this.operators.add("export")
        if (node.exportKind === "type") {
            this.operators.add("type")
        }
        this.operators.add("default")
    },
    ExportNamedDeclaration(
        this: ExtractTokensContext,
        node: TSESTree.ExportNamedDeclaration,
    ) {
        this.operators.add("export")
        if (node.specifiers.length) {
            if (node.exportKind === "type") {
                this.operators.add("type")
            }
            this.operators.add("{}")
            this.operators.add(",", node.specifiers.length - 1)
        }
        if (node.source) {
            this.operators.add("from")
        }
        if (node.assertions && node.assertions.length) {
            this.operators.add("assert")
            this.operators.add("{}")
        }
    },
    ExportSpecifier(
        this: ExtractTokensContext,
        node: TSESTree.ExportSpecifier,
    ) {
        if (node.exportKind === "type") {
            this.operators.add("type")
        }
        if (node.local.name !== node.exported.name) {
            this.operators.add("as")
        }
    },
    ExpressionStatement: noop,
    ForInStatement(this: ExtractTokensContext) {
        this.operators.add("for()")
        this.operators.add("in")
    },
    ForOfStatement(this: ExtractTokensContext) {
        this.operators.add("for()")
        this.operators.add("of")
    },
    ForStatement(this: ExtractTokensContext) {
        this.operators.add("for()")
        this.operators.add(";", 2)
    },
    FunctionDeclaration(
        this: ExtractTokensContext,
        node: TSESTree.FunctionDeclaration,
    ) {
        if (node.async) {
            this.operators.add("async")
        }
        this.operators.add("function")
        if (node.generator) {
            this.operators.add("*")
        }
        this.operators.add("()")
        this.operators.add(",", node.params.length - 1)

        if (node.declare) this.operators.add("declare")
    },
    FunctionExpression(
        this: ExtractTokensContext,
        node: TSESTree.FunctionExpression,
        parent: TSESTree.Node | null,
    ) {
        if (node.async) {
            this.operators.add("async")
        }

        if (
            !parent ||
            parent.type !== AST_NODE_TYPES.MethodDefinition &&
                (parent.type !== AST_NODE_TYPES.Property || !parent.method) &&
                parent.type !== AST_NODE_TYPES.TSAbstractMethodDefinition
        ) {
            this.operators.add("function")
        }

        if (node.generator) {
            this.operators.add("*")
        }
        this.operators.add("()")
        this.operators.add(",", node.params.length - 1)

        if (node.declare) this.operators.add("declare")
    },
    Identifier(
        this: ExtractTokensContext,
        node: TSESTree.Identifier,
        parent: TSESTree.Node | null,
    ) {
        if (parent) {
            if (
                parent.type === AST_NODE_TYPES.Property &&
                parent.shorthand &&
                parent.value === node
            )
                return
            if (
                parent.type === AST_NODE_TYPES.ImportSpecifier &&
                parent.imported.name === node.name &&
                parent.local === node
            )
                return
            if (
                parent.type === AST_NODE_TYPES.ExportSpecifier &&
                parent.local.name === node.name &&
                parent.exported === node
            )
                return
        }
        this.operands.add(node.name)
    },
    IfStatement(this: ExtractTokensContext, node: TSESTree.IfStatement) {
        this.operators.add("if()")
        if (node.alternate) {
            this.operators.add("else")
        }
    },
    ImportAttribute(this: ExtractTokensContext) {
        this.operators.add(":")
    },
    ImportDeclaration(
        this: ExtractTokensContext,
        node: TSESTree.ImportDeclaration,
    ) {
        this.operators.add("import")
        if (node.importKind === "type") {
            this.operators.add("type")
        }
        if (
            node.specifiers.some(
                (spec) => spec.type === AST_NODE_TYPES.ImportSpecifier,
            )
        ) {
            this.operators.add("{}")
            this.operators.add(",", node.specifiers.length - 1)
        }
        if (node.specifiers.length) {
            this.operators.add("from")
        }
        if (node.assertions && node.assertions.length) {
            this.operators.add("assert")
            this.operators.add("{}")
        }
    },
    ImportDefaultSpecifier: noop,
    ImportExpression(
        this: ExtractTokensContext,
        node: TSESTree.ImportExpression,
    ) {
        this.operators.add("import")
        if (node.attributes) {
            this.operators.add(",")
        }
    },
    ImportNamespaceSpecifier(this: ExtractTokensContext) {
        this.operators.add("*")
        this.operators.add("as")
    },
    ImportSpecifier(
        this: ExtractTokensContext,
        node: TSESTree.ImportSpecifier,
    ) {
        if (node.importKind === "type") {
            this.operators.add("type")
        }
        if (node.local.name !== node.imported.name) {
            this.operators.add("as")
        }
    },
    JSXAttribute(this: ExtractTokensContext) {
        this.operators.add("=")
    },
    JSXClosingElement(this: ExtractTokensContext) {
        this.operators.add("</")
        this.operators.add(">")
    },
    JSXClosingFragment(this: ExtractTokensContext) {
        this.operators.add("</")
        this.operators.add(">")
    },
    JSXElement: noop,
    JSXEmptyExpression: noop,
    JSXExpressionContainer(this: ExtractTokensContext) {
        this.operators.add("{}")
    },
    JSXFragment: noop,
    JSXIdentifier(this: ExtractTokensContext, node: TSESTree.JSXIdentifier) {
        this.operands.add(node.name)
    },
    JSXMemberExpression(this: ExtractTokensContext) {
        this.operators.add(".")
    },
    JSXNamespacedName(this: ExtractTokensContext) {
        this.operators.add(":")
    },
    JSXOpeningElement(this: ExtractTokensContext) {
        this.operators.add("<")
        this.operators.add(">")
    },
    JSXOpeningFragment(this: ExtractTokensContext) {
        this.operators.add("<")
        this.operators.add(">")
    },
    JSXSpreadAttribute(this: ExtractTokensContext) {
        this.operators.add("{}")
        this.operators.add("...")
    },
    JSXSpreadChild(this: ExtractTokensContext) {
        this.operators.add("{}")
        this.operators.add("...")
    },
    JSXText(this: ExtractTokensContext, node: TSESTree.JSXText) {
        this.operands.add(JSON.stringify(node.value))
    },
    LabeledStatement(this: ExtractTokensContext) {
        this.operators.add(":")
    },
    Literal(this: ExtractTokensContext, node: TSESTree.Literal) {
        if ("bigint" in node && node.bigint) {
            this.operands.add(`${node.bigint}n`)
        } else if ("regex" in node && node.regex) {
            this.operands.add(`/${node.regex.pattern}/${node.regex.flags}`)
        } else {
            this.operands.add(JSON.stringify(node.value))
        }
    },
    LogicalExpression(
        this: ExtractTokensContext,
        node: TSESTree.LogicalExpression,
    ) {
        this.operators.add(node.operator)

        if (getPrecedence(node) >= getPrecedence(node.right)) {
            this.operators.add("()")
        }
    },
    MemberExpression(
        this: ExtractTokensContext,
        node: TSESTree.MemberExpression,
    ) {
        if (getPrecedence(node) > getPrecedence(node.object)) {
            this.operators.add("()")
        }
        if (node.optional) {
            this.operators.add("?.")
            if (node.computed) {
                this.operators.add("[]")
            }
        } else if (node.computed) {
            this.operators.add("[]")
        } else {
            this.operators.add(".")
        }
    },
    MetaProperty(this: ExtractTokensContext) {
        this.operators.add(".")
    },
    MethodDefinition(
        this: ExtractTokensContext,
        node: TSESTree.MethodDefinition,
    ) {
        if (node.accessibility) this.operators.add(node.accessibility)
        if (node.static) this.operators.add("static")
        if (node.kind === "get" || node.kind === "set")
            this.operators.add(node.kind)
        if (node.computed) {
            this.operators.add("[]")
        }
    },
    NewExpression(this: ExtractTokensContext, node: TSESTree.NewExpression) {
        this.operators.add("new")

        if (getPrecedence(node) >= getPrecedence(node.callee)) {
            this.operators.add("()")
        }

        this.operators.add("()")
        this.operators.add(",", node.arguments.length - 1)
    },
    ObjectExpression(
        this: ExtractTokensContext,
        node: TSESTree.ObjectExpression,
    ) {
        this.operators.add("{}")
        this.operators.add(",", node.properties.length - 1)
    },
    ObjectPattern(this: ExtractTokensContext, node: TSESTree.ObjectPattern) {
        this.operators.add("{}")
        this.operators.add(",", node.properties.length - 1)
    },
    PrivateIdentifier(
        this: ExtractTokensContext,
        node: TSESTree.PrivateIdentifier,
    ) {
        this.operands.add(`#${node.name}`)
    },
    Program: noop,
    Property(this: ExtractTokensContext, node: TSESTree.Property) {
        if (node.kind === "get" || node.kind === "set")
            this.operators.add(node.kind)
        if (node.computed) {
            this.operators.add("[]")
        }
        if (!node.shorthand && !node.method) {
            this.operators.add(":")
        }
    },
    PropertyDefinition(
        this: ExtractTokensContext,
        node: TSESTree.PropertyDefinition,
    ) {
        if (node.accessibility) this.operators.add(node.accessibility)
        if (node.static) this.operators.add("static")
        if (node.readonly) this.operators.add("readonly")
        if (node.computed) {
            this.operators.add("[]")
        }
        if (node.value) {
            this.operators.add("=")
        }
    },
    RestElement(this: ExtractTokensContext) {
        this.operators.add("...")
    },
    ReturnStatement(this: ExtractTokensContext) {
        this.operators.add("return")
    },
    SequenceExpression(
        this: ExtractTokensContext,
        node: TSESTree.SequenceExpression,
    ) {
        this.operators.add(",", node.expressions.length - 1)
    },
    SpreadElement(this: ExtractTokensContext) {
        this.operators.add("...")
    },
    StaticBlock(this: ExtractTokensContext) {
        this.operators.add("static")
        this.operators.add("{}")
    },
    Super(this: ExtractTokensContext) {
        this.operands.add("super")
    },
    SwitchCase(this: ExtractTokensContext, node: TSESTree.SwitchCase) {
        if (node.test) {
            this.operators.add("case")
        } else {
            this.operators.add("default")
        }
        this.operators.add(":")
    },
    SwitchStatement(this: ExtractTokensContext) {
        this.operators.add("switch()")
        this.operators.add("{}")
    },
    TaggedTemplateExpression: noop,
    TemplateElement(
        this: ExtractTokensContext,
        node: TSESTree.TemplateElement,
        parent: TSESTree.Node | null,
    ) {
        let open = "`"
        let close = "`"
        if (
            parent &&
            (parent.type === AST_NODE_TYPES.TemplateLiteral ||
                parent.type === AST_NODE_TYPES.TSTemplateLiteralType)
        ) {
            const index = parent.quasis.indexOf(node)
            if (index > 0) {
                open = "}"
            }
            if (index < parent.quasis.length - 1) {
                close = "${"
            }
        }
        this.operands.add(`${open}${node.value.cooked}${close}`)
    },
    TemplateLiteral: noop,
    ThisExpression(this: ExtractTokensContext) {
        this.operands.add("this")
    },
    ThrowStatement(this: ExtractTokensContext) {
        this.operators.add("throw")
    },
    TryStatement(this: ExtractTokensContext, node: TSESTree.TryStatement) {
        this.operators.add("try")
        if (node.finalizer) {
            this.operators.add("finally")
        }
    },
    UnaryExpression(
        this: ExtractTokensContext,
        node: TSESTree.UnaryExpression,
    ) {
        this.operators.add(node.operator)

        if (getPrecedence(node) >= getPrecedence(node.argument)) {
            this.operators.add("()")
        }
    },
    UpdateExpression(
        this: ExtractTokensContext,
        node: TSESTree.UpdateExpression,
    ) {
        this.operators.add(node.operator)

        if (getPrecedence(node) >= getPrecedence(node.argument)) {
            this.operators.add("()")
        }
    },
    VariableDeclaration(
        this: ExtractTokensContext,
        node: TSESTree.VariableDeclaration,
    ) {
        this.operators.add(node.kind)
        this.operators.add(",", node.declarations.length - 1)

        if (node.declare) this.operators.add("declare")
    },
    VariableDeclarator(
        this: ExtractTokensContext,
        node: TSESTree.VariableDeclarator,
    ) {
        if (node.init) {
            this.operators.add("=")
        }
    },
    WhileStatement(this: ExtractTokensContext) {
        this.operators.add("while()")
    },
    WithStatement(this: ExtractTokensContext) {
        this.operators.add("with()")
    },
    YieldExpression(
        this: ExtractTokensContext,
        node: TSESTree.YieldExpression,
    ) {
        this.operators.add("yield")
        if (node.delegate) {
            this.operators.add("*")
        }
        if (
            node.argument &&
            getPrecedence(node) > getPrecedence(node.argument)
        ) {
            this.operators.add("()")
        }
    },

    // TS
    TSAbstractKeyword(this: ExtractTokensContext) {
        this.operators.add("abstract")
    },
    TSAbstractMethodDefinition(
        this: ExtractTokensContext,
        node: TSESTree.TSAbstractMethodDefinition,
    ) {
        this.operators.add("abstract")
        if (node.accessibility) this.operators.add(node.accessibility)
        if (node.static) this.operators.add("static")
        if (node.kind === "get" || node.kind === "set")
            this.operators.add(node.kind)
        if (node.computed) {
            this.operators.add("[]")
        }
    },
    TSAbstractPropertyDefinition(
        this: ExtractTokensContext,
        node: TSESTree.TSAbstractPropertyDefinition,
    ) {
        this.operators.add("abstract")
        if (node.accessibility) this.operators.add(node.accessibility)
        if (node.static) this.operators.add("static")
        if (node.computed) {
            this.operators.add("[]")
        }
        if (node.value) {
            this.operators.add("=")
        }
    },
    TSAnyKeyword(this: ExtractTokensContext) {
        this.operands.add("any")
    },
    TSArrayType(this: ExtractTokensContext) {
        this.operators.add("[]")
    },
    TSAsExpression(this: ExtractTokensContext) {
        this.operators.add("as")
    },
    TSAsyncKeyword(this: ExtractTokensContext) {
        this.operators.add("async")
    },
    TSBigIntKeyword(this: ExtractTokensContext) {
        this.operands.add("bigint")
    },
    TSBooleanKeyword(this: ExtractTokensContext) {
        this.operands.add("boolean")
    },
    TSCallSignatureDeclaration(
        this: ExtractTokensContext,
        node: TSESTree.TSCallSignatureDeclaration,
    ) {
        this.operators.add("()")
        this.operators.add(",", node.params.length - 1)
    },
    TSClassImplements: noop,
    TSConditionalType(this: ExtractTokensContext) {
        this.operators.add("extends")
        this.operators.add("?:")
    },
    TSConstructSignatureDeclaration(
        this: ExtractTokensContext,
        node: TSESTree.TSConstructSignatureDeclaration,
    ) {
        this.operators.add("new")
        this.operators.add("()")
        this.operators.add(",", node.params.length - 1)
    },
    TSConstructorType(
        this: ExtractTokensContext,
        node: TSESTree.TSConstructorType,
    ) {
        this.operators.add("new")
        this.operators.add("()")
        this.operators.add(",", node.params.length - 1)
    },
    TSDeclareFunction(
        this: ExtractTokensContext,
        node: TSESTree.TSDeclareFunction,
    ) {
        if (node.async) {
            this.operators.add("async")
        }
        this.operators.add("function")
        if (node.generator) {
            this.operators.add("*")
        }
        this.operators.add("()")
        this.operators.add(",", node.params.length - 1)
    },
    TSDeclareKeyword(this: ExtractTokensContext) {
        this.operators.add("declare")
    },
    TSEmptyBodyFunctionExpression(
        this: ExtractTokensContext,
        node: TSESTree.TSEmptyBodyFunctionExpression,
        parent: TSESTree.Node | null,
    ) {
        if (node.async) {
            this.operators.add("async")
        }

        if (
            !parent ||
            parent.type !== AST_NODE_TYPES.MethodDefinition &&
                (parent.type !== AST_NODE_TYPES.Property || !parent.method) &&
                parent.type !== AST_NODE_TYPES.TSAbstractMethodDefinition
        ) {
            this.operators.add("function")
        }

        if (node.generator) {
            this.operators.add("*")
        }
        this.operators.add("()")
        this.operators.add(",", node.params.length - 1)

        if (node.declare) this.operators.add("declare")
    },
    TSEnumDeclaration(
        this: ExtractTokensContext,
        node: TSESTree.TSEnumDeclaration,
    ) {
        if (node.const) this.operators.add("const")
        this.operators.add("enum")
        this.operators.add("{}")
        this.operators.add(",", node.members.length - 1)

        if (node.declare) this.operators.add("declare")
    },
    TSEnumMember(this: ExtractTokensContext, node: TSESTree.TSEnumMember) {
        if (node.computed) {
            this.operators.add("[]")
        }
        if (node.initializer) {
            this.operators.add("=")
        }
    },
    TSExportAssignment(this: ExtractTokensContext) {
        this.operators.add("export")
        this.operators.add("=")
    },
    TSExportKeyword(this: ExtractTokensContext) {
        this.operators.add("export")
    },
    TSExternalModuleReference(this: ExtractTokensContext) {
        this.operands.add("require")
        this.operators.add("()")
    },
    TSFunctionType(this: ExtractTokensContext, node: TSESTree.TSFunctionType) {
        this.operators.add("()")
        this.operators.add(",", node.params.length - 1)
    },
    TSImportEqualsDeclaration(this: ExtractTokensContext) {
        this.operators.add("import")
        this.operators.add("=")
    },
    TSImportType(this: ExtractTokensContext, node: TSESTree.TSImportType) {
        this.operators.add("import")
        this.operators.add("()")
        if (node.qualifier) {
            this.operators.add(".")
        }
    },
    TSIndexSignature(this: ExtractTokensContext, node) {
        this.operators.add("[]")
        if (node.readonly) this.operators.add("readonly")
        if (node.static) this.operators.add("static")
        if (node.export) this.operators.add("export")
    },
    TSIndexedAccessType(this: ExtractTokensContext) {
        this.operators.add("[]")
    },
    TSInferType(this: ExtractTokensContext) {
        this.operators.add("infer")
    },
    TSInterfaceBody(this: ExtractTokensContext) {
        this.operators.add("{}")
    },
    TSInterfaceDeclaration(
        this: ExtractTokensContext,
        node: TSESTree.TSInterfaceDeclaration,
    ) {
        this.operators.add("interface")
        if (node.extends) {
            this.operators.add("extends")
            this.operators.add(",", node.extends.length - 1)
        }
        if (node.implements) {
            this.operators.add("implements")
            this.operators.add(",", node.implements.length - 1)
        }
        if (node.abstract) {
            this.operators.add("abstract")
        }
        if (node.declare) this.operators.add("declare")
    },
    TSInterfaceHeritage: noop,
    TSIntersectionType(
        this: ExtractTokensContext,
        node: TSESTree.TSIntersectionType,
    ) {
        this.operators.add("&", node.types.length - 1)
    },
    TSIntrinsicKeyword(this: ExtractTokensContext) {
        this.operands.add("intrinsic")
    },
    TSLiteralType: noop,
    TSMappedType(this: ExtractTokensContext, node: TSESTree.TSMappedType) {
        this.operators.add("{}")
        if (node.readonly) {
            if (typeof node.readonly === "string") {
                this.operators.add(node.readonly)
            }
            this.operators.add("readonly")
        }

        this.operators.add("[]")
        if (node.optional) {
            if (typeof node.optional === "string") {
                this.operators.add(node.optional)
            }
            this.operators.add("?")
        }
        this.operators.add(":")
    },
    TSMethodSignature(
        this: ExtractTokensContext,
        node: TSESTree.TSMethodSignature,
    ) {
        if (node.accessibility) this.operators.add(node.accessibility)
        if (node.readonly) this.operators.add("readonly")
        if (node.static) this.operators.add("static")
        if (node.export) this.operators.add("export")
        if (node.kind === "get" || node.kind === "set")
            this.operators.add(node.kind)
        if (node.computed) this.operators.add("[]")
        if (node.optional) this.operators.add("?")

        this.operators.add("()")
        this.operators.add(",", node.params.length - 1)
    },
    TSModuleBlock(this: ExtractTokensContext) {
        this.operators.add("{}")
    },
    TSModuleDeclaration(
        this: ExtractTokensContext,
        node: TSESTree.TSModuleDeclaration,
    ) {
        if (node.declare) this.operators.add("declare")
        if (!node.global) {
            this.operators.add("module")
        }
    },
    TSNamespaceExportDeclaration(this: ExtractTokensContext) {
        this.operators.add("export")
        this.operators.add("as")
        this.operators.add("namespace")
    },
    TSNamedTupleMember(
        this: ExtractTokensContext,
        node: TSESTree.TSNamedTupleMember,
    ) {
        if (node.optional) this.operators.add("?")
        this.operators.add(":")
    },
    TSNeverKeyword(this: ExtractTokensContext) {
        this.operands.add("never")
    },
    TSNonNullExpression(this: ExtractTokensContext) {
        this.operators.add("!")
    },
    TSNullKeyword(this: ExtractTokensContext) {
        this.operands.add("null")
    },
    TSNumberKeyword(this: ExtractTokensContext) {
        this.operands.add("number")
    },
    TSObjectKeyword(this: ExtractTokensContext) {
        this.operands.add("object")
    },
    TSOptionalType(this: ExtractTokensContext) {
        this.operators.add("?")
    },
    TSParameterProperty(
        this: ExtractTokensContext,
        node: TSESTree.TSParameterProperty,
    ) {
        if (node.accessibility) this.operators.add(node.accessibility)
        if (node.readonly) this.operators.add("readonly")
        if (node.static) this.operators.add("static")
        if (node.export) this.operators.add("export")
    },
    TSPrivateKeyword(this: ExtractTokensContext) {
        this.operators.add("private")
    },
    TSPropertySignature(
        this: ExtractTokensContext,
        node: TSESTree.TSPropertySignature,
    ) {
        if (node.accessibility) this.operators.add(node.accessibility)
        if (node.readonly) this.operators.add("readonly")
        if (node.static) this.operators.add("static")
        if (node.export) this.operators.add("export")
        if (node.computed) this.operators.add("[]")
        if (node.optional) this.operators.add("?")
    },
    TSProtectedKeyword(this: ExtractTokensContext) {
        this.operators.add("protected")
    },
    TSPublicKeyword(this: ExtractTokensContext) {
        this.operators.add("public")
    },
    TSQualifiedName(this: ExtractTokensContext) {
        this.operators.add(".")
    },
    TSReadonlyKeyword(this: ExtractTokensContext) {
        this.operators.add("readonly")
    },
    TSRestType(this: ExtractTokensContext) {
        this.operators.add("...")
    },
    TSStaticKeyword(this: ExtractTokensContext) {
        this.operators.add("static")
    },
    TSStringKeyword(this: ExtractTokensContext) {
        this.operands.add("string")
    },
    TSSymbolKeyword(this: ExtractTokensContext) {
        this.operands.add("symbol")
    },
    TSTemplateLiteralType: noop,
    TSThisType(this: ExtractTokensContext) {
        this.operands.add("this")
    },
    TSTupleType(this: ExtractTokensContext, node) {
        this.operators.add("[]")
        this.operators.add(",", node.elementTypes.length - 1)
    },
    TSTypeAliasDeclaration(this: ExtractTokensContext) {
        this.operators.add("type")
        this.operators.add("=")
    },
    TSTypeAnnotation(
        this: ExtractTokensContext,
        node: TSESTree.TSTypeAnnotation,
        parent: TSESTree.Node | null,
    ) {
        if (parent) {
            if (
                parent.type === AST_NODE_TYPES.TSFunctionType &&
                    parent.returnType === node ||
                parent.type === AST_NODE_TYPES.TSConstructorType &&
                    parent.returnType === node
            ) {
                this.operators.add("=>")
                return
            }
            if (parent.type === AST_NODE_TYPES.TSTypePredicate) {
                return
            }
        }
        this.operators.add(":")
    },
    TSTypeAssertion(this: ExtractTokensContext) {
        this.operators.add("<>")
    },
    TSTypeLiteral(this: ExtractTokensContext) {
        this.operators.add("{}")
    },
    TSTypeOperator(this: ExtractTokensContext) {
        this.operators.add("keyof")
    },
    TSTypeParameter(
        this: ExtractTokensContext,
        node: TSESTree.TSTypeParameter,
        parent,
    ) {
        if (node.constraint) {
            if (
                parent &&
                parent.type === AST_NODE_TYPES.TSMappedType &&
                parent.typeParameter === node
            ) {
                this.operators.add("in")
            } else {
                this.operators.add("extends")
            }
        }
        if (node.default) {
            this.operators.add("=")
        }
    },
    TSTypeParameterDeclaration(
        this: ExtractTokensContext,
        node: TSESTree.TSTypeParameterDeclaration,
    ) {
        this.operators.add("<>")
        this.operators.add(",", node.params.length - 1)
    },
    TSTypeParameterInstantiation(
        this: ExtractTokensContext,
        node: TSESTree.TSTypeParameterInstantiation,
    ) {
        this.operators.add("<>")
        this.operators.add(",", node.params.length - 1)
    },
    TSTypePredicate(this: ExtractTokensContext) {
        this.operators.add("is")
    },
    TSTypeQuery(this: ExtractTokensContext) {
        this.operators.add("typeof")
    },
    TSTypeReference: noop,
    TSUndefinedKeyword(this: ExtractTokensContext) {
        this.operands.add("undefined")
    },
    TSUnionType(this: ExtractTokensContext, node: TSESTree.TSUnionType) {
        this.operators.add("|", node.types.length - 1)
    },
    TSUnknownKeyword(this: ExtractTokensContext) {
        this.operands.add("unknown")
    },
    TSVoidKeyword(this: ExtractTokensContext) {
        this.operands.add("void")
    },
}

/**
 * Extract tokens
 */
export function extractTokens(
    node: ESTree.Node | TSESTree.Node,
): ExtractTokensResult {
    const context = new ExtractTokensContext()

    walk(
        node as TSESTree.Node,
        (node: TSESTree.Node, parent: TSESTree.Node | null) => {
            const extract = EXTRACT_TOKENS[node.type] as any
            if (
                extract &&
                Object.prototype.hasOwnProperty.call(EXTRACT_TOKENS, node.type)
            ) {
                extract.call(context, node, parent)
            }
        },
    )

    return context
}
