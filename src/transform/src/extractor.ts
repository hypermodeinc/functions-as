import binaryen from "assemblyscript/lib/binaryen.js";
import {
  ArrayLiteralExpression,
  Class,
  ElementKind,
  Expression,
  FloatLiteralExpression,
  Function as Func,
  FunctionDeclaration,
  IntegerLiteralExpression,
  LiteralExpression,
  LiteralKind,
  NodeKind,
  Program,
  Property,
  StringLiteralExpression,
  Type,
} from "assemblyscript/dist/assemblyscript.js";
import {
  FunctionSignature,
  Parameter,
  ProgramInfo,
  TypeDefinition,
  TypeInfo,
  typeMap,
} from "./types.js";
import HypermodeTransform from "./index.js";

export class Extractor {
  binaryen: typeof binaryen;
  module: binaryen.Module;
  program: Program;
  transform: HypermodeTransform;

  constructor(transform: HypermodeTransform, module: binaryen.Module) {
    this.program = transform.program;
    this.binaryen = transform.binaryen;
    this.module = module;
  }

  getProgramInfo(): ProgramInfo {
    const functions = this.getExportedFunctions()
      .map((e) => this.convertToFunctionSignature(e))
      .sort((a, b) => a.name.localeCompare(b.name));

    const hostFunctions = this.getHostFunctions()
      .map((e) => this.convertToFunctionSignature(e))
      .sort((a, b) => a.name.localeCompare(b.name));

    const allTypes = new Map<string, TypeDefinition>(
      Array.from(this.program.managedClasses.values())
        .filter((c) => c.id > 2) // skip built-in classes
        .map((c) => {
          const info = getTypeInfo(c.type);
          return new TypeDefinition(
            c.id,
            c.nextMemoryOffset, // size
            info.path,
            info.name,
            this.getClassFields(c),
          );
        })
        .map((t) => [t.path, t]),
    );

    const typePathsUsed = new Set(
      functions
        .concat(hostFunctions)
        .flatMap((f) =>
          f.parameters.map((p) => p.type.path).concat(f.returnType.path),
        )
        .map((p) => p.replace(/\|null$/, "")),
    );

    const typesUsed = new Map<string, TypeDefinition>();
    allTypes.forEach((t) => {
      if (typePathsUsed.has(t.path)) {
        typesUsed.set(t.path, t);
      }
    });

    typesUsed.forEach((t) => {
      this.expandDependentTypes(t, allTypes, typesUsed);
    });

    const types = Array.from(typesUsed.values()).sort((a, b) =>
      (a.name + a.path).localeCompare(b.name + b.path),
    );

    return { functions, types };
  }

  private expandDependentTypes(
    type: TypeDefinition,
    allTypes: Map<string, TypeDefinition>,
    typesUsed: Map<string, TypeDefinition>,
  ) {
    // collect dependent types into this set
    const dependentTypes = new Set<TypeDefinition>();

    // include fields
    if (type.fields) {
      type.fields.forEach((f) => {
        let path = f.type.path;
        if (path.endsWith("|null")) {
          path = path.slice(0, -5);
        }
        const typeDef = allTypes.get(path);
        if (typeDef) {
          dependentTypes.add(typeDef);
        }
      });
    }

    // include generic type arguments
    const cls = this.program.managedClasses.get(type.id);
    if (cls.typeArguments) {
      cls.typeArguments.forEach((t) => {
        const typeDef = allTypes.get(t.toString());
        if (typeDef) {
          dependentTypes.add(typeDef);
        }
      });
    }

    // recursively expand dependencies of dependent types
    dependentTypes.forEach((t) => {
      if (!typesUsed.has(t.path)) {
        typesUsed.set(t.path, t);
        this.expandDependentTypes(t, allTypes, typesUsed);
      }
    });
  }

  private getClassFields(c: Class) {
    if (
      c.isArrayLike ||
      typeMap.has(c.type.toString()) ||
      typeMap.has(c.prototype.internalName)
    ) {
      return undefined;
    }

    return Array.from(c.members.values())
      .filter((m) => m.kind === ElementKind.PropertyPrototype)
      .map((m) => {
        const instance = this.program.instancesByName.get(m.internalName);
        return instance as Property;
      })
      .filter((p) => p && p.isField)
      .map((f) => ({
        offset: f.memoryOffset,
        name: f.name,
        type: getTypeInfo(f.type),
      }));
  }

  private getExportedFunctions() {
    const results: importExportInfo[] = [];

    for (let i = 0; i < this.module.getNumExports(); ++i) {
      const ref = this.module.getExportByIndex(i);
      const info = this.binaryen.getExportInfo(ref);

      if (info.kind !== binaryen.ExternalFunction) {
        continue;
      }

      const exportName = info.name;
      if (exportName.startsWith("_")) {
        continue;
      }

      const functionName = info.value.replace(/^export:/, "");
      results.push({ name: exportName, function: functionName });
    }

    return results;
  }

  private getHostFunctions() {
    const results: importExportInfo[] = [];
    const hypermodeImports = this.program.moduleImports.get("hypermode");
    if (hypermodeImports) {
      hypermodeImports.forEach((v, k) => {
        results.push({ name: k, function: v.internalName });
      });
    }
    return results;
  }

  private convertToFunctionSignature(e: importExportInfo): FunctionSignature {
    const f = this.program.instancesByName.get(e.function) as Func;
    const d = f.declaration as FunctionDeclaration;
    const params: Parameter[] = [];
    for (let i = 0; i < f.signature.parameterTypes.length; i++) {
      const param = d.signature.parameters[i];
      const _type = f.signature.parameterTypes[i];
      const name = param.name.text;
      const type = getTypeInfo(_type);
      const defaultValue = getLiteral(param.initializer);
      params.push({
        name,
        type,
        defaultValue,
      });
    }
    return new FunctionSignature(
      e.name,
      params,
      getTypeInfo(f.signature.returnType),
    );
  }
}

interface importExportInfo {
  name: string;
  function: string;
}

export function getTypeInfo(t: Type): TypeInfo {
  const path = t.toString();

  if (t.isNullableReference) {
    const ti = getTypeInfo(t.nonNullableType);
    return { name: `${ti.name} | null`, path: path.replace(/ /g, "") };
  }

  let name = typeMap.get(path);
  if (name) {
    return { name, path };
  }

  const c = t.classReference;
  if (!c) {
    return { name: path, path };
  }

  switch (c.prototype?.internalName) {
    case "~lib/array/Array": {
      const wrap = c.typeArguments[0].isNullableReference;
      const open = wrap ? "(" : "";
      const close = wrap ? ")" : "";
      name = `${open}${getTypeInfo(c.typeArguments[0]).name}${close}[]`;
      break;
    }
    case "~lib/map/Map": {
      name = `Map<${getTypeInfo(c.typeArguments[0]).name}, ${getTypeInfo(c.typeArguments[1]).name}>`;
      break;
    }
    default:
      name = c.name;
  }

  return { name, path };
}

export function getLiteral(node: Expression | null): string {
  if (!node) return "";
  switch (node.kind) {
    case NodeKind.True: {
      return "true";
    }
    case NodeKind.False: {
      return "false";
    }
    case NodeKind.Null: {
      return "null";
    }
    case NodeKind.Literal: {
      const _node = node as LiteralExpression;
      switch (_node.literalKind) {
        case LiteralKind.Integer: {
          return i64_to_string((_node as IntegerLiteralExpression).value);
        }
        case LiteralKind.Float: {
          return (_node as FloatLiteralExpression).value.toString();
        }
        case LiteralKind.String: {
          return (_node as StringLiteralExpression).value;
        }
        case LiteralKind.Array: {
          let out = "[";
          const literals = (_node as ArrayLiteralExpression).elementExpressions;
          for (let i = 0; i < literals.length - 1; i++) {
            const lit = getLiteral(literals[i]);
            if (lit) out += lit + ",";
          }
          const lit = getLiteral(literals[literals.length - 1]);
          if (lit) out += lit + "]";
          return out;
        }
      }
    }
  }
  return "";
}

export function literalToString(literal: literalType): string {
  if (literal instanceof Array) {
    let out = "[";
    for (let i = 0; i < literal.length - 1; i++) {
      const lit = literalToString(literal[i]);
      if (lit) out += lit + ",";
    }
    const lit = literalToString(literal[literal.length - 1]);
    if (lit) out += lit;
    return out + "]";
  }
  return literal as string;
}
