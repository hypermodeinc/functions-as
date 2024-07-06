import {
  ArrayLiteralExpression,
  BlockStatement,
  CommonFlags,
  FunctionDeclaration,
  IdentifierExpression,
  IntegerLiteralExpression,
  LiteralExpression,
  LiteralKind,
  NamedTypeNode,
  NewExpression,
  Node,
  NodeKind,
  ObjectLiteralExpression,
  ParameterKind,
  Parser,
  Range,
  Source,
  SourceKind,
  StringLiteralExpression,
  Token,
  Tokenizer,
} from "assemblyscript";
import { Parameter } from "./types.js";
class OptionalParam {
  param: Parameter;
  optional: boolean = false;
  defaultValue: string | null = null;
}

export class MultiParamGen {
  static SN: MultiParamGen = new MultiParamGen();
  public optionalParams = new Map<string, OptionalParam[]>();
  constructor() {}
  static init(): MultiParamGen {
    if (!MultiParamGen.SN) MultiParamGen.SN = new MultiParamGen();
    return MultiParamGen.SN;
  }
  visitSource(source: Source) {
    for (const stmt of source.statements) {
      if (stmt.kind === NodeKind.FunctionDeclaration) {
        const node = stmt as FunctionDeclaration;
        if (
          node.flags === CommonFlags.Export &&
          source.sourceKind === SourceKind.UserEntry
        ) {
          let name = node.name.text;
          if (!node.body && node.decorators?.length) {
            const decorator = node.decorators.find(
              (e) => (e.name as IdentifierExpression).text === "external",
            );
            if (
              decorator.args.length > 1 &&
              decorator.args[1].kind === NodeKind.Literal
            ) {
              name = (
                decorator.args[1] as StringLiteralExpression
              ).value.toString();
            }
          }
          const params: OptionalParam[] = [];
          for (const param of node.signature.parameters) {
            let defaultValue = "...";
            if (param.initializer) {
              if (
                isNumberType(
                  (param.type as unknown as NamedTypeNode).name.identifier.text,
                )
              ) {
                defaultValue = (
                  param.initializer as IntegerLiteralExpression
                ).value.toString();
                if (defaultValue.length > 5)
                  defaultValue = defaultValue.slice(0, 5) + "...";
              } else if (param.initializer.kind === NodeKind.New) {
                if (!(param.initializer as NewExpression).args.length) {
                  defaultValue = "{}";
                } else {
                  defaultValue = "{...}";
                }
              } else if (
                param.initializer.kind === NodeKind.Literal &&
                (param.initializer as LiteralExpression).literalKind ==
                  LiteralKind.Object
              ) {
                if (
                  !(param.initializer as ObjectLiteralExpression).values
                    .length &&
                  !(param.initializer as ObjectLiteralExpression).names.length
                ) {
                  defaultValue = "[]";
                } else {
                  defaultValue = "[...]";
                }
              } else if (
                param.initializer.kind === NodeKind.Literal &&
                (param.initializer as LiteralExpression).literalKind ==
                  LiteralKind.String
              ) {
                defaultValue =
                  '"' +
                  (param.initializer as StringLiteralExpression).value +
                  '"';
                if (defaultValue.length > 3)
                  defaultValue = defaultValue.slice(0, 4) + '..."';
              } else if (
                param.initializer.kind === NodeKind.Literal &&
                (param.initializer as LiteralExpression).literalKind ==
                  LiteralKind.Array
              ) {
                if (
                  !(param.initializer as ArrayLiteralExpression)
                    .elementExpressions.length
                ) {
                  defaultValue = "[]";
                } else {
                  defaultValue = "[...]";
                }
              } else if (param.initializer.kind === NodeKind.Null) {
                defaultValue = "null";
              }
            }
            params.push({
              param: {
                name: param.name.text,
                type: {
                  name: "UNINITIALIZED_VALUE",
                  path: "UNINITIALIZED_VALUE",
                },
              },
              optional: param.initializer ? true : false,
              defaultValue: param.initializer ? defaultValue : null,
            });
          }
          this.optionalParams.set(name, params);

          if (
            node.signature.parameters.filter((v) => v.initializer).length >= 2
          ) {
            let body: BlockStatement;
            if (node.body.kind != NodeKind.Block) {
              body = Node.createBlockStatement([node.body], node.range);
            } else {
              body = node.body as BlockStatement;
            }
            node.signature.parameters.push(
              Node.createParameter(
                ParameterKind.Default,
                Node.createIdentifierExpression(
                  "__SUPPLIED_PARAMS",
                  node.range,
                  false,
                ),
                Node.createNamedType(
                  Node.createSimpleTypeName("u64", node.range),
                  [],
                  false,
                  node.range,
                ),
                null,
                node.range,
              ),
            );
            let first = true;
            for (let i = 1; i < node.signature.parameters.length; i++) {
              const param = node.signature.parameters[i];
              if (!param.initializer) continue;
              const stmt = Node.createIfStatement(
                Node.createBinaryExpression(
                  Token.Equals_Equals,
                  Node.createParenthesizedExpression(
                    Node.createBinaryExpression(
                      Token.Ampersand,
                      first
                        ? ((first = false),
                          Node.createIdentifierExpression(
                            "__SUPPLIED_PARAMS",
                            node.range,
                          ))
                        : Node.createParenthesizedExpression(
                            Node.createBinaryExpression(
                              Token.GreaterThan_GreaterThan,
                              Node.createIdentifierExpression(
                                "__SUPPLIED_PARAMS",
                                node.range,
                              ),
                              newIntegerLiteral(i - 1, node.range),
                              node.range,
                            ),
                            node.range,
                          ),
                      newIntegerLiteral(1, node.range),
                      node.range,
                    ),
                    node.range,
                  ),
                  newIntegerLiteral(0, node.range),
                  node.range,
                ),
                Node.createExpressionStatement(
                  Node.createBinaryExpression(
                    Token.Equals,
                    Node.createIdentifierExpression(
                      param.name.text,
                      node.range,
                      false,
                    ),
                    param.initializer,
                    node.range,
                  ),
                ),
                null,
                node.range,
              );
              body.statements.unshift(stmt);
              if (param.initializer) param.initializer = null;
            }
          }
        }
        if (node.body == null) {
          let name = node.name.text;
          if (!node.body && node.decorators?.length) {
            const decorator = node.decorators.find(
              (e) => (e.name as IdentifierExpression).text === "external",
            );
            if (
              decorator.args.length > 1 &&
              decorator.args[1].kind === NodeKind.Literal
            ) {
              name = (
                decorator.args[1] as StringLiteralExpression
              ).value.toString();
            }
          }
          const params: OptionalParam[] = [];
          for (const param of node.signature.parameters) {
            let defaultValue = "...";
            if (param.initializer) {
              if (
                isNumberType(
                  (param.type as unknown as NamedTypeNode).name.identifier.text,
                )
              ) {
                defaultValue = (
                  param.initializer as IntegerLiteralExpression
                ).value.toString();
                if (defaultValue.length > 3)
                  defaultValue = defaultValue.slice(0, 3) + "...";
              } else if (param.initializer.kind === NodeKind.New) {
                if (!(param.initializer as NewExpression).args.length) {
                  defaultValue = "{}";
                } else {
                  defaultValue = "{...}";
                }
              } else if (
                param.initializer.kind === NodeKind.Literal &&
                (param.initializer as LiteralExpression).literalKind ==
                  LiteralKind.Object
              ) {
                if (
                  !(param.initializer as ObjectLiteralExpression).values
                    .length &&
                  !(param.initializer as ObjectLiteralExpression).names.length
                ) {
                  defaultValue = "[]";
                } else {
                  defaultValue = "[...]";
                }
              } else if (
                param.initializer.kind === NodeKind.Literal &&
                (param.initializer as LiteralExpression).literalKind ==
                  LiteralKind.String
              ) {
                defaultValue =
                  '"' +
                  (param.initializer as StringLiteralExpression).value +
                  '"';
                if (defaultValue.length > 3)
                  defaultValue = defaultValue.slice(0, 4) + '..."';
              } else if (
                param.initializer.kind === NodeKind.Literal &&
                (param.initializer as LiteralExpression).literalKind ==
                  LiteralKind.Array
              ) {
                if (
                  !(param.initializer as ArrayLiteralExpression)
                    .elementExpressions.length
                ) {
                  defaultValue = "[]";
                } else {
                  defaultValue = "[...]";
                }
              } else if (param.initializer.kind === NodeKind.Null) {
                defaultValue = "null";
              }
            }
            params.push({
              param: {
                name: param.name.text,
                type: {
                  name: "UNINITIALIZED_VALUE",
                  path: "UNINITIALIZED_VALUE",
                },
              },
              optional: param.initializer ? true : false,
              defaultValue: param.initializer ? defaultValue : null,
            });
          }
          this.optionalParams.set(name, params);
        }
      }
    }
  }
}

function isNumberType(tp: string): boolean {
  switch (tp) {
    case "u8":
    case "u16":
    case "u32":
    case "u64":
    case "i8":
    case "i16":
    case "i32":
    case "i64":
    case "f32":
    case "f64":
      return true;
    default:
      return false;
  }
}

const parser = new Parser();
function newIntegerLiteral(
  num: number,
  range: Range,
): IntegerLiteralExpression {
  const source = new Source(
    SourceKind.User,
    range.source.normalizedPath,
    num.toString(),
  );
  const tokenizer = new Tokenizer(source);
  parser.currentSource = source;
  const int = parser.parseExpression(tokenizer) as IntegerLiteralExpression;
  int.range = range;
  return int;
}
