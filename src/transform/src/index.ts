import { HypermodeMetadata } from "./metadata.js";
import { Extractor } from "./extractor.js";

import { Transform } from "assemblyscript/dist/transform.js";
import binaryen from "assemblyscript/lib/binaryen.js";

export default class HypermodeTransform extends Transform {
  afterCompile(module: binaryen.Module) {
    const extractor = new Extractor(this);
    const functions = extractor.getExportedFunctions(module);

    const m = HypermodeMetadata.generate();
    m.addFunctions(functions);
    m.writeToModule(module);
    m.logOutput();
  }
}
