import { Program } from "assemblyscript/dist/assemblyscript.js";
import { Transform } from "assemblyscript/dist/transform.js";
import binaryen from "assemblyscript/lib/binaryen.js";
import { FunctionSignature } from "./types.js";

export class Extractor {
  binaryen: typeof binaryen;
  module: binaryen.Module;
  program: Program;

  constructor(transform: Transform, module: binaryen.Module) {
    this.program = transform.program;
    this.binaryen = transform.binaryen;
    this.module = module;
  }

  async getExportedFunctions(): Promise<FunctionSignature[]> {
    const functions = await this.getAllFunctions();
    const paths = this.getExportedFunctionPaths();

    const results = paths
      .map((path) => functions.get(path))
      .filter((f) => f !== undefined)
      .sort((a, b) => a.name.localeCompare(b.name));

    return results;
  }

  private async getAllFunctions(): Promise<Map<string, FunctionSignature>> {
    ignoreCompilerMismatchWarning();
    const { HypermodeVisitor } = await import("./visitor.js");
    const visitor = new HypermodeVisitor();
    this.program.parser.sources.forEach((source) => visitor.visit(source));
    return visitor.functions;
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
