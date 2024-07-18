import { readFileSync } from "fs";
import { instantiate } from "../build/queryvars.spec.js";
import * as mocks from "./mocks.js";

const binary = readFileSync("./build/queryvars.spec.wasm");
const module = new WebAssembly.Module(binary);

instantiate(module, {
  env: {},
  hypermode: {
    ...mocks,
  },
});
