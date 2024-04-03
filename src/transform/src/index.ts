import { Transform } from "assemblyscript/dist/transform.js";
import { createWriteStream } from "fs";
import { HypermodeMetadata } from "./metadata.js";
import { Extractor } from "./extractor.js";

export default class HypermodeTransform extends Transform {
  async afterCompile(module) {
    const extractor = new Extractor(this, module);
    const functions = await extractor.getExportedFunctions();

    const m = HypermodeMetadata.generate();
    m.addFunctions(functions);
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
