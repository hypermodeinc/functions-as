import { model, ClassificationProbability, ClassificationResult } from "..";

describe("Model Host Functions", () => {
  it("can classify", () => {
    const result = model.classifyText("modelId", "text");
    const expected = new ClassificationResult();
    expected.probabilities = [
      new ClassificationProbability("A", 0.1),
      new ClassificationProbability("B", 0.2),
    ];

    expect(result).toStrictEqual(expected);
  });

  it("can classify multiple", () => {
    const texts = new Map<string, string>();
    const result = model.classifyTexts("modelId", texts);
    log(result);
    const expectedProbs1 = new ClassificationResult();
    expectedProbs1.probabilities = [
      new ClassificationProbability("A", 0.1),
      new ClassificationProbability("B", 0.2),
    ];
    const expectedProbs2 = new ClassificationResult();
    expectedProbs2.probabilities = [
      new ClassificationProbability("A", 0.2),
      new ClassificationProbability("B", 0.3),
    ];
    const expected = new Map<string, ClassificationResult>();
    expected.set("text", expectedProbs1);
    expected.set("text2", expectedProbs2);
    expect(result).toStrictEqual(expected);
  });

  it("can compute embeddings", () => {
    const result = model.computeTextEmbedding("modelId", "text");
    const expected = "[0.1, 0.2, 0.3]";
    expect(result).toStrictEqual(expected);
  });

  it("can compute multiple embeddings", () => {
    const texts = new Map<string, string>();
    const result = model.computeTextEmbeddings("modelId", texts);
    const expected = new Map<string, string>();
    expected.set("text", "[0.1, 0.2, 0.3]");
    expected.set("text2", "[0.2, 0.3, 0.4]");

    expect(result).toStrictEqual(expected);
  });
});
