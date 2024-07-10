import { Transform } from "assemblyscript/dist/transform.js";
import { createWriteStream } from "fs";
import { HypermodeMetadata } from "./metadata.js";
import { Extractor } from "./extractor.js";
import binaryen from "assemblyscript/lib/binaryen.js";
import { Parser, Range, Source } from "assemblyscript/dist/assemblyscript.js";
import { MultiParamGen } from "./multiparam.js";
export default class HypermodeTransform extends Transform {
  afterParse(parser: Parser) {
    const mpgen = MultiParamGen.init();
    const sources = parser.sources
      .filter((source) => !isStdlib(source))
      .sort((_a, _b) => {
        const a = _a.internalPath;
        const b = _b.internalPath;
        if (a[0] === "~" && b[0] !== "~") {
          return -1;
        } else if (a[0] !== "~" && b[0] === "~") {
          return 1;
        } else {
          return 0;
        }
      });

    for (const source of sources) {
      mpgen.visitSource(source);
    }
  }
  afterCompile(module: binaryen.Module) {
    const extractor = new Extractor(this, module);
    const info = extractor.getProgramInfo();

    const m = HypermodeMetadata.generate();
    m.addFunctions(info.functions);
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

const isStdlibRegex =
  /~lib\/(?:array|arraybuffer|atomics|builtins|crypto|console|compat|dataview|date|diagnostics|error|function|iterator|map|math|number|object|process|reference|regexp|set|staticarray|string|symbol|table|typedarray|vector|rt\/?|bindings\/|shared\/typeinfo)|util\/|uri|polyfills|memory/;
function isStdlib(
  s:
    | Source
    | {
        range: Range;
      },
): boolean {
  const source = s instanceof Source ? s : s.range.source;
  return isStdlibRegex.test(source.internalPath);
}
