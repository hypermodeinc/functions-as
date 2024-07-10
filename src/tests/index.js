import { readFileSync } from "fs";
import { instantiate } from "../build/inference.spec.js";

const binary = readFileSync("./build/inference.spec.wasm");
const module = new WebAssembly.Module(binary);

instantiate(module, {
  hypermode: {
    invokeTextGenerator(modelName, instruction, sentence, format) {
      let response;

      switch (format) {
        case "text":
          response = sentence;
          break;

        case "json_object":
          if (instruction.includes("JSON array")) {
            response = `{"list":[${sentence},${sentence}]}`;
          } else {
            response = sentence;
          }
          break;

        default:
          throw new Error(`Unknown format: ${format}`);
      }

      return response;
    },
  },
});
