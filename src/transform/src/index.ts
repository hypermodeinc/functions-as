import { Transform } from "assemblyscript/dist/transform.js";
import { createWriteStream } from "fs";
import { HypermodeMetadata } from "./metadata.js";
import { Extractor } from "./extractor.js";
import binaryen from "assemblyscript/lib/binaryen.js";
import {
  Parser,
  FunctionDeclaration,
  IdentifierExpression,
  NodeKind,
  CommonFlags,
} from "assemblyscript/dist/assemblyscript.js";
import { isStdlib } from "./utils.js";

export default class HypermodeTransform extends Transform {
  public embedders: string[] | null = null;
  afterParse(parser: Parser): void | Promise<void> {
    for (const source of parser.sources) {
      if (source.isLibrary) continue;
      if (isStdlib(source)) continue;
      const exportedFunctions = source.statements.filter(
        (e) =>
          e.kind == NodeKind.FunctionDeclaration &&
          (<FunctionDeclaration>e).flags == CommonFlags.Export,
      ) as FunctionDeclaration[];
      this.embedders = exportedFunctions
        .filter((e) =>
          e.decorators?.find(
            (v) => (<IdentifierExpression>v.name).text == "embedder",
          ),
        )
        .map((e) => e.name.text);
      break;
    }
  }
  afterCompile(module: binaryen.Module) {
    const extractor = new Extractor(this, module);
    const info = extractor.getProgramInfo();

    const m = HypermodeMetadata.generate();
    m.addFunctions(info.functions);
    m.addEmbedders(info.embedders);
    m.addTypes(info.types);
    m.writeToModule(module);

    // Write to stdout
    m.logToStream(process.stdout);

    // If running in GitHub Actions, also write to the step summary
    if (process.env.GITHUB_ACTIONS && process.env.GITHUB_STEP_SUMMARY) {
      const stream = createWriteStream(process.env.GITHUB_STEP_SUMMARY, {
        flags: "a",
      });
      m.logToStream(stream, true);
    }
  }
}
