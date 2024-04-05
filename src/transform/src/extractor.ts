import { Program } from "assemblyscript/dist/assemblyscript.js";
import { Transform } from "assemblyscript/dist/transform.js";
import binaryen from "assemblyscript/lib/binaryen.js";
import { FunctionSignature, TypeDefinition } from "./types.js";

class ProgramInfo {
  functions: FunctionSignature[];
  types: TypeDefinition[];
}

class RawProgramInfo {
  functions: Map<string, FunctionSignature>;
  classes: Map<string, TypeDefinition>;
  typesUsed: Map<string, string[]>;
}

export class Extractor {
  binaryen: typeof binaryen;
  module: binaryen.Module;
  program: Program;

  constructor(transform: Transform, module: binaryen.Module) {
    this.program = transform.program;
    this.binaryen = transform.binaryen;
    this.module = module;
  }

  async getProgramInfo(): Promise<ProgramInfo> {
    const info = await this.getRawProgramInfo();
    const paths = this.getExportedFunctionPaths();

    const exportedFunctions = paths
      .map((path) => info.functions.get(path))
      .filter((f) => f !== undefined)
      .sort((a, b) => a.name.localeCompare(b.name));

    const typesUsedByExportedFunctions = Array.from(
      new Set(
        exportedFunctions
          .flatMap((f) => f.parameters.map((p) => p.type).concat(f.returnType))
          .flatMap((t) => info.typesUsed.get(t)),
      ),
    );

    const classes = Array.from(info.classes.values());
    const dependentTypes = Array.from(
      classes
        .filter((t) => typesUsedByExportedFunctions.includes(t.name))
        .flatMap((t) => this.expandDependentTypes(t, classes, info.typesUsed))
        .reduce((acc, t) => {
          acc.set(t.name, t);
          return acc;
        }, new Map<string, TypeDefinition>())
        .values(),
    ).sort((a, b) => a.name.localeCompare(b.name));

    return { functions: exportedFunctions, types: dependentTypes };
  }

  private expandDependentTypes(
    type: TypeDefinition,
    allTypes: TypeDefinition[],
    typeMap: Map<string, string[]>,
  ): TypeDefinition[] {
    if (!type.fields || type.fields.length === 0) {
      return [type];
    }

    const typeNames = Array.from(
      new Set(type.fields.flatMap((f) => typeMap.get(f.type))),
    );

    return typeNames
      .map((tn) => allTypes.find((t) => t.name === tn))
      .filter((t) => t !== undefined)
      .flatMap((t) => this.expandDependentTypes(t, allTypes, typeMap))
      .concat(type);
  }

  private async getRawProgramInfo(): Promise<RawProgramInfo> {
    ignoreCompilerMismatchWarning();
    const { HypermodeVisitor } = await import("./visitor.js");
    const visitor = new HypermodeVisitor();
    this.program.parser.sources.forEach((source) => visitor.visit(source));
    return {
      functions: visitor.functions,
      classes: visitor.classes,
      typesUsed: visitor.typesUsed,
    };
  }

  private getExportedFunctionPaths(): string[] {
    const paths = [];

    const funcs = new Map<string, binaryen.FunctionInfo>();
    for (let i = 0; i < this.module.getNumFunctions(); ++i) {
      const ref = this.module.getFunctionByIndex(i);
      const info = this.binaryen.getFunctionInfo(ref);
      funcs.set(info.name, info);
    }

    for (let i = 0; i < this.module.getNumExports(); ++i) {
      const ref = this.module.getExportByIndex(i);
      const info = this.binaryen.getExportInfo(ref);

      if (info.kind !== binaryen.ExternalFunction) {
        continue;
      }

      if (info.name.startsWith("_")) {
        continue;
      }

      const f = funcs.get(info.value);
      if (f === undefined) {
        continue;
      }

      paths.push(info.value.replace(/^export:/, ""));
    }

    return paths;
  }
}

const cw = console.warn;
function ignoreCompilerMismatchWarning() {
  console.warn = (message?: unknown, ...optionalParams: unknown[]): void => {
    if (message === "compiler mismatch: std/portable included twice") {
      return;
    }
    cw(message, ...optionalParams);
  };
}
