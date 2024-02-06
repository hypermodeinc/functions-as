import { model, ClassificationProbability, ClassificationResult } from "..";

describe("Model Host Functions", () => {
  it("can classify", () => {
    const result = model.classify("modelId", "text");

    const expected = new ClassificationResult();
    expected.probabilities = [
      new ClassificationProbability("A", 0.1),
      new ClassificationProbability("B", 0.2),
    ];

    expect(result).toStrictEqual(expected);
  });
});
