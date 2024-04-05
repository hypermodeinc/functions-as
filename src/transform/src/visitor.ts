import { FunctionSignature, TypeDefinition } from "./types.js";
import { BaseVisitor, utils } from "visitor-as";
import {
  ClassDeclaration,
  FieldDeclaration,
  FunctionDeclaration,
  FunctionTypeNode,
  NamedTypeNode,
  NodeKind,
  TypeNode,
} from "assemblyscript/dist/assemblyscript.js";

export class HypermodeVisitor extends BaseVisitor {
  functions = new Map<string, FunctionSignature>();
  classes = new Map<string, TypeDefinition>();
  typesUsed = new Map<string, string[]>();

  visitFunctionDeclaration(node: FunctionDeclaration): void {
    const internalPath = node.range.source.internalPath;
    const name = node.name.text;
    const path = `${internalPath}/${name}`;

    const signature = node.signature;
    const parameters = signature.parameters.map((p) => ({
      name: p.name.text,
      type: getTypeName(p.type),
    }));

    const returnTypeName = getTypeName(signature.returnType);

    const f = new FunctionSignature(name, parameters, returnTypeName);
    this.functions.set(path, f);

    this.setUsedTypes(signature);
  }

  visitClassDeclaration(node: ClassDeclaration): void {
    const internalPath = node.range.source.internalPath;
    const name = node.name.text;
    const path = `${internalPath}/${name}`;

    const fields = node.members
      .map((m) => {
        if (m.kind === NodeKind.FieldDeclaration) {
          const field = m as FieldDeclaration;
          const typeName = getTypeName(field.type);
          const typesUsed = this.resolveTypeNames(field.type);
          this.typesUsed.set(typeName, typesUsed);
          return {
            name: field.name.text,
            type: typeName,
          };
        }
      })
      .filter((f) => f !== undefined);

    const t = new TypeDefinition(name, fields);
    this.classes.set(path, t);
  }

  private setUsedTypes(signature: FunctionTypeNode) {
    signature.parameters
      .map((p) => p.type)
      .concat(signature.returnType)
      .forEach((t) => {
        const typeName = getTypeName(t);
        const typesUsed = this.resolveTypeNames(t);
        this.typesUsed.set(typeName, typesUsed);
      });
  }

  private resolveTypeNames(tn: TypeNode): string[] {
    if (tn.kind !== NodeKind.NamedType) {
      return [];
    }

    const node = tn as NamedTypeNode;
    const name = node.name.identifier.text;

    const results = [];
    if (!handledTypes.has(name)) {
      results.push(name);
    }
    node.typeArguments.forEach((t) =>
      results.push(...this.resolveTypeNames(t)),
    );

    return Array.from(new Set(results));
  }
}

const handledTypes = new Set([
  "string",
  "bool",
  "i64",
  "i32",
  "i16",
  "i8",
  "u64",
  "u32",
  "u16",
  "u8",
  "f64",
  "f32",
  "Array",
  "Map",
  "Date",
]);

const arrayRegex = /^Array<(.+)>/;
function getTypeName(t: TypeNode): string {
  // this does most of the work
  let s = utils.toString(t);

  // replace Array<T> with T[]
  for (;;) {
    const match = s.match(arrayRegex);
    if (match === null) {
      break;
    }

    let t = match[1];
    if (t.endsWith(" | null")) {
      t = `(${t})`;
    }

    s = t + "[]" + s.slice(match[0].length);
  }

  return s;
}
