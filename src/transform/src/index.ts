import { Transform } from "assemblyscript/dist/transform.js";
import { HypermodeMetadata } from "./metadata.js";
import { Extractor } from "./extractor.js";
import writeLogo from "./logo.js";

export default class HypermodeTransform extends Transform {
  afterCompile(module) {
    const extractor = new Extractor(this, module);
    const functions = extractor.getExportedFunctions();

    const m = HypermodeMetadata.generate();
    m.addFunctions(functions);
    m.writeToModule(module);

    writeLogo(process.stdout);
    m.logToStream(process.stdout);
  }
}
