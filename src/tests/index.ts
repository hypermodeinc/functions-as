import { readFileSync } from "fs";
import { instantiate } from "../build/inference.spec.js";
import * as mocks from "./mocks.js"

const binary = readFileSync("./build/inference.spec.wasm");
const module = new WebAssembly.Module(binary);

instantiate(module, {
  env: {},
  hypermode: {
    ...mocks
  },
});
