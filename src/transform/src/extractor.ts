import { Program } from "assemblyscript/dist/assemblyscript.js";
import { Transform } from "assemblyscript/dist/transform.js";
import binaryen from "assemblyscript/lib/binaryen.js";
import { HypermodeVisitor } from "./visitor.js";
import { FunctionSignature } from "./types.js";

export class Extractor {
  binaryen: typeof binaryen;
  program: Program;

  constructor(transform: Transform) {
    this.binaryen = transform.binaryen;
    this.program = transform.program;
  }

  getExportedFunctions(module: binaryen.Module): FunctionSignature[] {
    const functions = this.getAllFunctions();
    const paths = this.getExportedFunctionPaths(module);

    const results = paths
      .map((path) => functions.get(path))
      .filter((f) => f !== undefined)
      .sort((a, b) => a.name.localeCompare(b.name));

    return results;
  }

  private getAllFunctions(): Map<string, FunctionSignature> {
    const visitor = new HypermodeVisitor();
    this.program.parser.sources.forEach((source) => visitor.visit(source));
    return visitor.functions;
  }

  private getExportedFunctionPaths(module: binaryen.Module): string[] {
    const paths = [];
    const n = module.getNumExports();

    for (let i = 0; i < n; ++i) {
      const ref = module.getExportByIndex(i);
      const info = this.binaryen.getExportInfo(ref);

      if (info.kind !== binaryen.ExternalFunction) {
        continue;
      }

      if (info.name.startsWith("_")) {
        continue;
      }

      paths.push(info.value.replace(/^export:/, ""));
    }

    return paths;
  }
}
