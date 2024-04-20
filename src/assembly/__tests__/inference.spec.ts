import { inference } from "..";

describe("Model Host Functions", () => {
  it("can compute probability", () => {
    const result = inference.computeClassificationProbablity(
      "modelId",
      "text",
      "A",
    );
    const expected = f32(0.1);

    expect(result).toStrictEqual(expected);
  });

  it("can classify", () => {
    const result = inference.classifyText("modelId", "text", 0);
    const expected = "B";

    expect(result).toStrictEqual(expected);
  });

  it("can compute classification labels for text", () => {
    const text = "text";
    const result = inference.computeClassificationLabelsForText(
      "modelId",
      text,
    );
    const expected = new Map<string, f32>();
    expected.set("A", 0.1);
    expected.set("B", 0.2);

    expect(result).toStrictEqual(expected);
  });

  it("can compute classification labels for texts", () => {
    const texts = new Map<string, string>();
    const result = inference.computeClassificationLabelsForTexts(
      "modelId",
      texts,
    );
    const expected = new Map<string, Map<string, f32>>();
    expected.set("text", new Map<string, f32>());
    expected.get("text").set("A", 0.1);
    expected.get("text").set("B", 0.2);

    expected.set("text2", new Map<string, f32>());
    expected.get("text2").set("A", 0.2);
    expected.get("text2").set("B", 0.3);
    expect(result).toStrictEqual(expected);
  });

  it("can compute embeddings", () => {
    const result = inference.embedText("modelId", "text");
    const expected = [0.1, 0.2, 0.3];
    expect(result).toStrictEqual(expected);
  });

  it("can compute multiple embeddings", () => {
    const texts = new Map<string, string>();
    const result = inference.embedTexts("modelId", texts);
    const expected = new Map<string, f64[]>();
    expected.set("text", [0.1, 0.2, 0.3]);
    expected.set("text2", [0.2, 0.3, 0.4]);

    expect(result).toStrictEqual(expected);
  });

  it("can generate text", () => {
    const input = "sentence";
    const result = inference.generateText("modelId", "instruction", input);
    const expected = input;

    expect(result).toBe(expected);
  });

  it("can generate an object", () => {
    const input = '{"input": "sentence"}';
    const sample = new Map<string, string>();
    const result = inference.generate<Map<string, string>>(
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
});
