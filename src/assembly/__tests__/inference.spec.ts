import {
  expect,
  run,
  it,
} from "as-test";

import { inference } from "../inference";

it("can generate text", () => {
  const input = "sentence";
  const result = inference.generateText("modelId", "instruction", input);
  const expected = input;

  expect(result).toBe(expected);
});

it("can generate an object", () => {
  const input = '{"input": "sentence"}';
  const sample = new Map<string, string>();
  const result = inference.generateData<Map<string, string>>(
    "modelId",
    "instruction",
    input,
    sample,
  );
  expect(result.get("input")).toBe("sentence");
});

it("can generate a list of objects", () => {
  const input = '{"input": "sentence"}';
  const sample = new Map<string, string>();
  const result = inference.generateList<Map<string, string>>(
    "modelId",
    "instruction",
    input,
    sample,
  );
  expect(result.length).toBe(2);
  expect(result[0].get("input")).toBe("sentence");
  expect(result[1].get("input")).toBe("sentence");
});

run({
  log: false,
});
