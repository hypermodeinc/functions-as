import {
  ArrayLiteralExpression,
  AssertionExpression,
  BinaryExpression,
  CallExpression,
  ElementAccessExpression,
  FloatLiteralExpression,
  FunctionTypeNode,
  IdentifierExpression,
  NamedTypeNode,
  Node,
  ObjectLiteralExpression,
  Source,
  TypeNode,
  TypeParameterNode,
  BlockStatement,
  BreakStatement,
  ClassDeclaration,
  ClassExpression,
  CommaExpression,
  ConstructorExpression,
  ContinueStatement,
  DecoratorNode,
  DoStatement,
  EmptyStatement,
  EnumDeclaration,
  EnumValueDeclaration,
  ExportDefaultStatement,
  ExportImportStatement,
  ExportMember,
  ExportStatement,
  Expression,
  ExpressionStatement,
  FalseExpression,
  FieldDeclaration,
  ForStatement,
  FunctionDeclaration,
  FunctionExpression,
  IfStatement,
  ImportDeclaration,
  ImportStatement,
  IndexSignatureNode,
  InstanceOfExpression,
  IntegerLiteralExpression,
  InterfaceDeclaration,
  LiteralExpression,
  MethodDeclaration,
  NamespaceDeclaration,
  NewExpression,
  NullExpression,
  ParameterNode,
  ParenthesizedExpression,
  PropertyAccessExpression,
  RegexpLiteralExpression,
  ReturnStatement,
  Statement,
  StringLiteralExpression,
  SuperExpression,
  SwitchCase,
  SwitchStatement,
  TemplateLiteralExpression,
  TernaryExpression,
  ThisExpression,
  ThrowStatement,
  TrueExpression,
  TryStatement,
  TypeDeclaration,
  TypeName,
  UnaryExpression,
  UnaryPostfixExpression,
  UnaryPrefixExpression,
  VariableDeclaration,
  VariableStatement,
  VoidStatement,
  WhileStatement,
  NodeKind,
  LiteralKind,
} from "assemblyscript/dist/assemblyscript.js";

export declare type Collection<T> =
  | Node
  | T[]
  | Map<string, T | T[] | Iterable<T>>
  | Iterable<T>;

export class Visitor {
  public currentSource: Source | null = null;
  public depth = 0;
  visit<T>(
    node: T | T[] | Map<string, T | T[] | Iterable<T>> | Iterable<T>,
  ): void {
    if (node == null) {
      return;
    } else if (node instanceof Array) {
      for (const element of node) {
        this.visit(element);
      }
    } else if (node instanceof Map) {
      for (const element of node.values()) {
        this.visit(element);
      }
    } else if (typeof node[Symbol.iterator] === "function") {
      for (const element of node as Iterable<T>) {
        this.visit(element);
      }
    } else {
      // @ts-expect-error: caught at the end of _visit()
      this._visit(node);
    }
  }
  private _visit(node: Node): void {
    switch (node.kind) {
      case NodeKind.Source: {
        this.visitSource(<Source>node);
        break;
      }

      // types

      case NodeKind.NamedType: {
        this.visitNamedTypeNode(<NamedTypeNode>node);
        break;
      }
      case NodeKind.FunctionType: {
        this.visitFunctionTypeNode(<FunctionTypeNode>node);
        break;
      }
      case NodeKind.TypeName: {
        this.visitTypeName(<TypeName>node);
        break;
      }
      case NodeKind.TypeParameter: {
        this.visitTypeParameter(<TypeParameterNode>node);
        break;
      }

      // expressions

      case NodeKind.False:
      case NodeKind.Null:
      case NodeKind.Super:
      case NodeKind.This:
      case NodeKind.True:
      case NodeKind.Constructor:
      case NodeKind.Identifier: {
        this.visitIdentifierExpression(<IdentifierExpression>node);
        break;
      }
      case NodeKind.Assertion: {
        this.visitAssertionExpression(<AssertionExpression>node);
        break;
      }
      case NodeKind.Binary: {
        this.visitBinaryExpression(<BinaryExpression>node);
        break;
      }
      case NodeKind.Call: {
        this.visitCallExpression(<CallExpression>node);
        break;
      }
      case NodeKind.Class: {
        this.visitClassExpression(<ClassExpression>node);
        break;
      }
      case NodeKind.Comma: {
        this.visitCommaExpression(<CommaExpression>node);
        break;
      }
      case NodeKind.ElementAccess: {
        this.visitElementAccessExpression(<ElementAccessExpression>node);
        break;
      }
      case NodeKind.Function: {
        this.visitFunctionExpression(<FunctionExpression>node);
        break;
      }
      case NodeKind.InstanceOf: {
        this.visitInstanceOfExpression(<InstanceOfExpression>node);
        break;
      }
      case NodeKind.Literal: {
        this.visitLiteralExpression(<LiteralExpression>node);
        break;
      }
      case NodeKind.New: {
        this.visitNewExpression(<NewExpression>node);
        break;
      }
      case NodeKind.Parenthesized: {
        this.visitParenthesizedExpression(<ParenthesizedExpression>node);
        break;
      }
      case NodeKind.PropertyAccess: {
        this.visitPropertyAccessExpression(<PropertyAccessExpression>node);
        break;
      }
      case NodeKind.Ternary: {
        this.visitTernaryExpression(<TernaryExpression>node);
        break;
      }
      case NodeKind.UnaryPostfix: {
        this.visitUnaryPostfixExpression(<UnaryPostfixExpression>node);
        break;
      }
      case NodeKind.UnaryPrefix: {
        this.visitUnaryPrefixExpression(<UnaryPrefixExpression>node);
        break;
      }

      // statements

      case NodeKind.Block: {
        this.visitBlockStatement(<BlockStatement>node);
        break;
      }
      case NodeKind.Break: {
        this.visitBreakStatement(<BreakStatement>node);
        break;
      }
      case NodeKind.Continue: {
        this.visitContinueStatement(<ContinueStatement>node);
        break;
      }
      case NodeKind.Do: {
        this.visitDoStatement(<DoStatement>node);
        break;
      }
      case NodeKind.Empty: {
        this.visitEmptyStatement(<EmptyStatement>node);
        break;
      }
      case NodeKind.Export: {
        this.visitExportStatement(<ExportStatement>node);
        break;
      }
      case NodeKind.ExportDefault: {
        this.visitExportDefaultStatement(<ExportDefaultStatement>node);
        break;
      }
      case NodeKind.ExportImport: {
        this.visitExportImportStatement(<ExportImportStatement>node);
        break;
      }
      case NodeKind.Expression: {
        this.visitExpressionStatement(<ExpressionStatement>node);
        break;
      }
      case NodeKind.For: {
        this.visitForStatement(<ForStatement>node);
        break;
      }
      case NodeKind.If: {
        this.visitIfStatement(<IfStatement>node);
        break;
      }
      case NodeKind.Import: {
        this.visitImportStatement(<ImportStatement>node);
        break;
      }
      case NodeKind.Return: {
        this.visitReturnStatement(<ReturnStatement>node);
        break;
      }
      case NodeKind.Switch: {
        this.visitSwitchStatement(<SwitchStatement>node);
        break;
      }
      case NodeKind.Throw: {
        this.visitThrowStatement(<ThrowStatement>node);
        break;
      }
      case NodeKind.Try: {
        this.visitTryStatement(<TryStatement>node);
        break;
      }
      case NodeKind.Variable: {
        this.visitVariableStatement(<VariableStatement>node);
        break;
      }
      case NodeKind.While: {
        this.visitWhileStatement(<WhileStatement>node);
        break;
      }

      // declaration statements

      case NodeKind.ClassDeclaration: {
        this.visitClassDeclaration(<ClassDeclaration>node);
        break;
      }
      case NodeKind.EnumDeclaration: {
        this.visitEnumDeclaration(<EnumDeclaration>node);
        break;
      }
      case NodeKind.EnumValueDeclaration: {
        this.visitEnumValueDeclaration(<EnumValueDeclaration>node);
        break;
      }
      case NodeKind.FieldDeclaration: {
        this.visitFieldDeclaration(<FieldDeclaration>node);
        break;
      }
      case NodeKind.FunctionDeclaration: {
        this.visitFunctionDeclaration(<FunctionDeclaration>node);
        break;
      }
      case NodeKind.ImportDeclaration: {
        this.visitImportDeclaration(<ImportDeclaration>node);
        break;
      }
      case NodeKind.InterfaceDeclaration: {
        this.visitInterfaceDeclaration(<InterfaceDeclaration>node);
        break;
      }
      case NodeKind.MethodDeclaration: {
        this.visitMethodDeclaration(<MethodDeclaration>node);
        break;
      }
      case NodeKind.NamespaceDeclaration: {
        this.visitNamespaceDeclaration(<NamespaceDeclaration>node);
        break;
      }
      case NodeKind.TypeDeclaration: {
        this.visitTypeDeclaration(<TypeDeclaration>node);
        break;
      }
      case NodeKind.VariableDeclaration: {
        this.visitVariableDeclaration(<VariableDeclaration>node);
        break;
      }

      // other

      case NodeKind.Decorator: {
        this.visitDecoratorNode(<DecoratorNode>node);
        break;
      }
      case NodeKind.ExportMember: {
        this.visitExportMember(<ExportMember>node);
        break;
      }
      case NodeKind.Parameter: {
        this.visitParameter(<ParameterNode>node);
        break;
      }
      case NodeKind.SwitchCase: {
        this.visitSwitchCase(<SwitchCase>node);
        break;
      }
      case NodeKind.IndexSignature: {
        this.visitIndexSignature(<IndexSignatureNode>node);
        break;
      }
      default:
        throw new Error("Could not visit unknown type!");
    }
  }
  visitSource(node: Source): void {
    this.currentSource = node;
    for (const stmt of node.statements) {
      this.depth++;
      this._visit(stmt);
      this.depth--;
    }
    this.currentSource = null;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitTypeNode(_node: TypeNode): void {}
  visitTypeName(node: TypeName): void {
    this.visit(node.identifier);
    this.visit(node.next);
  }
  visitNamedTypeNode(node: NamedTypeNode): void {
    this.visit(node.name);
    this.visit(node.typeArguments);
  }
  visitFunctionTypeNode(node: FunctionTypeNode): void {
    this.visit(node.parameters);
    this.visit(node.returnType);
    this.visit(node.explicitThisType);
  }
  visitTypeParameter(node: TypeParameterNode): void {
    this.visit(node.name);
    this.visit(node.extendsType);
    this.visit(node.defaultType);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitIdentifierExpression(node: IdentifierExpression): void {}
  visitArrayLiteralExpression(node: ArrayLiteralExpression) {
    this.visit(node.elementExpressions);
  }
  visitObjectLiteralExpression(node: ObjectLiteralExpression) {
    this.visit(node.names);
    this.visit(node.values);
  }
  visitAssertionExpression(node: AssertionExpression) {
    this.visit(node.toType);
    this.visit(node.expression);
  }
  visitBinaryExpression(node: BinaryExpression) {
    this.visit(node.left);
    this.visit(node.right);
  }
  visitCallExpression(node: CallExpression) {
    this.visit(node.expression);
    this.visitArguments(node.typeArguments, node.args);
  }
  visitArguments(typeArguments: TypeNode[] | null, args: Expression[]) {
    this.visit(typeArguments);
    this.visit(args);
  }
  visitClassExpression(node: ClassExpression) {
    this.visit(node.declaration);
  }
  visitCommaExpression(node: CommaExpression) {
    this.visit(node.expressions);
  }
  visitElementAccessExpression(node: ElementAccessExpression) {
    this.visit(node.elementExpression);
    this.visit(node.expression);
  }
  visitFunctionExpression(node: FunctionExpression) {
    this.visit(node.declaration);
  }
  visitLiteralExpression(node: LiteralExpression) {
    switch (node.literalKind) {
      case LiteralKind.Float: {
        this.visitFloatLiteralExpression(<FloatLiteralExpression>node);
        break;
      }
      case LiteralKind.Integer: {
        this.visitIntegerLiteralExpression(
          <IntegerLiteralExpression>node
        );
        break;
      }
      case LiteralKind.String: {
        this.visitStringLiteralExpression(
          <StringLiteralExpression>node
        );
        break;
      }
      case LiteralKind.Template: {
        this.visitTemplateLiteralExpression(
          <TemplateLiteralExpression>node
        );
        break;
      }
      case LiteralKind.RegExp: {
        this.visitRegexpLiteralExpression(
          <RegexpLiteralExpression>node
        );
        break;
      }
      case LiteralKind.Array: {
        this.visitArrayLiteralExpression(<ArrayLiteralExpression>node);
        break;
      }
      case LiteralKind.Object: {
        this.visitObjectLiteralExpression(
          <ObjectLiteralExpression>node
        );
        break;
      }
      default:
        throw new Error("Invalid LiteralKind: " + node.literalKind);
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitFloatLiteralExpression(node: FloatLiteralExpression) {}
  visitInstanceOfExpression(node: InstanceOfExpression) {
    this.visit(node.expression);
    this.visit(node.isType);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitIntegerLiteralExpression(node: IntegerLiteralExpression) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitStringLiteral(str: string, singleQuoted: boolean = false) {}
  visitStringLiteralExpression(node: StringLiteralExpression) {
    this.visitStringLiteral(node.value);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitTemplateLiteralExpression(node: TemplateLiteralExpression) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitRegexpLiteralExpression(node: RegexpLiteralExpression) {}
  visitNewExpression(node: NewExpression) {
    this.visit(node.typeArguments);
    this.visitArguments(node.typeArguments, node.args);
    this.visit(node.args);
  }
  visitParenthesizedExpression(node: ParenthesizedExpression) {
    this.visit(node.expression);
  }
  visitPropertyAccessExpression(node: PropertyAccessExpression) {
    this.visit(node.property);
    this.visit(node.expression);
  }
  visitTernaryExpression(node: TernaryExpression) {
    this.visit(node.condition);
    this.visit(node.ifThen);
    this.visit(node.ifElse);
  }
  visitUnaryExpression(node: UnaryExpression) {
    this.visit(node.operand);
  }
  visitUnaryPostfixExpression(node: UnaryPostfixExpression) {
    this.visit(node.operand);
  }
  visitUnaryPrefixExpression(node: UnaryPrefixExpression) {
    this.visit(node.operand);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitSuperExpression(node: SuperExpression) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitFalseExpression(node: FalseExpression) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitTrueExpression(node: TrueExpression) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitThisExpression(node: ThisExpression) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitNullExperssion(node: NullExpression) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitConstructorExpression(node: ConstructorExpression) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitNodeAndTerminate(statement: Statement) {}
  visitBlockStatement(node: BlockStatement) {
    this.depth++;
    this.visit(node.statements);
    this.depth--;
  }
  visitBreakStatement(node: BreakStatement) {
    this.visit(node.label);
  }
  visitContinueStatement(node: ContinueStatement) {
    this.visit(node.label);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitClassDeclaration(node: ClassDeclaration, isDefault: boolean = false) {
    this.visit(node.name);
    this.depth++;
    this.visit(node.decorators);
    if (
      node.isGeneric ? node.typeParameters != null : node.typeParameters == null
    ) {
      this.visit(node.typeParameters);
      this.visit(node.extendsType);
      this.visit(node.implementsTypes);
      this.visit(node.members);
      this.depth--;
    } else {
      throw new Error(
        "Expected to type parameters to match class declaration, but found type mismatch instead!",
      );
    }
  }
  visitDoStatement(node: DoStatement) {
    this.visit(node.condition);
    this.visit(node.body);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitEmptyStatement(node: EmptyStatement) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitEnumDeclaration(node: EnumDeclaration, isDefault: boolean = false) {
    this.visit(node.name);
    this.visit(node.decorators);
    this.visit(node.values);
  }
  visitEnumValueDeclaration(node: EnumValueDeclaration) {
    this.visit(node.name);
    this.visit(node.initializer);
  }
  visitExportImportStatement(node: ExportImportStatement) {
    this.visit(node.name);
    this.visit(node.externalName);
  }
  visitExportMember(node: ExportMember) {
    this.visit(node.localName);
    this.visit(node.exportedName);
  }
  visitExportStatement(node: ExportStatement) {
    this.visit(node.path);
    this.visit(node.members);
  }
  visitExportDefaultStatement(node: ExportDefaultStatement) {
    this.visit(node.declaration);
  }
  visitExpressionStatement(node: ExpressionStatement) {
    this.visit(node.expression);
  }
  visitFieldDeclaration(node: FieldDeclaration) {
    this.visit(node.name);
    this.visit(node.type);
    this.visit(node.initializer);
    this.visit(node.decorators);
  }
  visitForStatement(node: ForStatement) {
    this.visit(node.initializer);
    this.visit(node.condition);
    this.visit(node.incrementor);
    this.visit(node.body);
  }
  visitFunctionDeclaration(
    node: FunctionDeclaration,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isDefault: boolean = false,
  ) {
    this.visit(node.name);
    this.visit(node.decorators);
    this.visit(node.typeParameters);
    this.visit(node.signature);
    this.depth++;
    this.visit(node.body);
    this.depth--;
  }
  visitIfStatement(node: IfStatement) {
    this.visit(node.condition);
    this.visit(node.ifTrue);
    this.visit(node.ifFalse);
  }
  visitImportDeclaration(node: ImportDeclaration) {
    this.visit(node.foreignName);
    this.visit(node.name);
    this.visit(node.decorators);
  }
  visitImportStatement(node: ImportStatement) {
    this.visit(node.namespaceName);
    this.visit(node.declarations);
  }
  visitIndexSignature(node: IndexSignatureNode) {
    this.visit(node.keyType);
    this.visit(node.valueType);
  }
  visitInterfaceDeclaration(
    node: InterfaceDeclaration,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isDefault: boolean = false,
  ) {
    this.visit(node.name);
    this.visit(node.typeParameters);
    this.visit(node.implementsTypes);
    this.visit(node.extendsType);
    this.depth++;
    this.visit(node.members);
    this.depth--;
  }
  visitMethodDeclaration(node: MethodDeclaration) {
    this.visit(node.name);
    this.visit(node.typeParameters);
    this.visit(node.signature);
    this.visit(node.decorators);
    this.depth++;
    this.visit(node.body);
    this.depth--;
  }
  visitNamespaceDeclaration(
    node: NamespaceDeclaration,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isDefault: boolean = false,
  ) {
    this.visit(node.name);
    this.visit(node.decorators);
    this.visit(node.members);
  }
  visitReturnStatement(node: ReturnStatement) {
    this.visit(node.value);
  }
  visitSwitchCase(node: SwitchCase) {
    this.visit(node.label);
    this.visit(node.statements);
  }
  visitSwitchStatement(node: SwitchStatement) {
    this.visit(node.condition);
    this.depth++;
    this.visit(node.cases);
    this.depth--;
  }
  visitThrowStatement(node: ThrowStatement) {
    this.visit(node.value);
  }
  visitTryStatement(node: TryStatement) {
    this.visit(node.bodyStatements);
    this.visit(node.catchVariable);
    this.visit(node.catchStatements);
    this.visit(node.finallyStatements);
  }
  visitTypeDeclaration(node: TypeDeclaration) {
    this.visit(node.name);
    this.visit(node.decorators);
    this.visit(node.type);
    this.visit(node.typeParameters);
  }
  visitVariableDeclaration(node: VariableDeclaration) {
    this.visit(node.name);
    this.visit(node.type);
    this.visit(node.initializer);
  }
  visitVariableStatement(node: VariableStatement) {
    this.visit(node.decorators);
    this.visit(node.declarations);
  }
  visitWhileStatement(node: WhileStatement) {
    this.visit(node.condition);
    this.depth++;
    this.visit(node.body);
    this.depth--;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitVoidStatement(node: VoidStatement) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitComment(node: Comment) {}
  visitDecoratorNode(node: DecoratorNode) {
    this.visit(node.name);
    this.visit(node.args);
  }
  visitParameter(node: ParameterNode) {
    this.visit(node.name);
    this.visit(node.implicitFieldDeclaration);
    this.visit(node.initializer);
    this.visit(node.type);
  }
}
