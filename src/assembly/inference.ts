import * as host from "./hypermode";
import * as utils from "./utils";
import { JSON } from "json-as";

export abstract class inference {
  public static getClassificationProbability(
    modelName: string,
    text: string,
    label: string,
  ): f32 {
    const labels = this.getClassificationLabelsForText(modelName, text);
    const keys = labels.keys();
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (key === label) {
        return labels.get(key);
      }
    }
    return 0.0;
  }

  public static classifyText(
    modelName: string,
    text: string,
    threshold: f32,
  ): string {
    const labels = this.getClassificationLabelsForText(modelName, text);

    const keys = labels.keys();
    let max = labels.get(keys[0]);
    let result = keys[0];
    for (let i = 1; i < keys.length; i++) {
      const key = keys[i];
      const value = labels.get(key);
      if (value >= max) {
        max = value;
        result = key;
      }
    }

    if (max < threshold) {
      return "";
    }
    return result;
  }

  public static getClassificationLabelsForText(
    modelName: string,
    text: string,
  ): Map<string, f32> {
    const textMap = new Map<string, string>();
    textMap.set("text", text);
    const res = this.getClassificationLabelsForTexts(modelName, textMap);
    return res.get("text");
  }

  public static getClassificationLabelsForTexts(
    modelName: string,
    texts: Map<string, string>,
  ): Map<string, Map<string, f32>> {
    const result = host.invokeClassifier(modelName, texts);
    if (utils.resultIsInvalid(result)) {
      throw new Error("Unable to classify text.");
    }
    return result;
  }

  public static getTextEmbedding(modelName: string, text: string): f64[] {
    const textMap = new Map<string, string>();
    textMap.set("text", text);
    const res = this.getTextEmbeddings(modelName, textMap);
    return res.get("text");
  }

  public static getTextEmbeddings(
    modelName: string,
    texts: Map<string, string>,
  ): Map<string, f64[]> {
    const result = host.computeEmbedding(modelName, texts);
    if (utils.resultIsInvalid(result)) {
      throw new Error("Unable to compute embeddings.");
    }
    return result;
  }

  public static createVectorIndex(
    vectorIndexName: string,
    indexType: string,
  ): host.VectorIndexActionResult {
    return host.createVectorIndex(vectorIndexName, indexType);
  }

  public static removeVectorIndex(
    vectorIndexName: string,
  ): host.VectorIndexActionResult {
    return host.removeVectorIndex(vectorIndexName);
  }

  public static insertToVectorIndex(
    vectorIndexName: string,
    id: string,
    vector: f64[],
  ): host.VectorIndexOperationResult {
    return host.insertToVectorIndex(vectorIndexName, id, vector);
  }

  public static searchVectorIndex(
    vectorIndexName: string,
    vector: f64[],
    limit: i32,
  ): host.VectorIndexOperationResult {
    return host.searchVectorIndex(vectorIndexName, vector, limit);
  }

  public static deleteFromVectorIndex(
    vectorIndexName: string,
    id: string,
  ): host.VectorIndexOperationResult {
    return host.deleteFromVectorIndex(vectorIndexName, id);
  }

  public static searchAndInsertToVectorIndex(
    vectorIndexName: string,
    id: string,
    vector: f64[],
    limit: i32,
  ): host.VectorIndexOperationResult {
    const searchResult = this.searchVectorIndex(vectorIndexName, vector, limit);

    const insertResult = this.insertToVectorIndex(vectorIndexName, id, vector);

    const result = new host.VectorIndexOperationResult();
    result.mutation = insertResult.mutation;
    result.query = searchResult.query;
    return result;
  }

  public static generateText(
    modelName: string,
    instruction: string,
    prompt: string,
  ): string {
    const result = host.invokeTextGenerator(
      modelName,
      instruction,
      prompt,
      "text",
    );
    if (utils.resultIsInvalid(result)) {
      throw new Error("Unable to generate text.");
    }
    return result;
  }

  public static generateData<TData>(
    modelName: string,
    instruction: string,
    text: string,
    sample: TData,
  ): TData {
    // Prompt trick: ask for a simple JSON object.
    const modifiedInstruction =
      "Only respond with valid JSON object in this format:\n" +
      JSON.stringify(sample) +
      "\n" +
      instruction;

    const result = host.invokeTextGenerator(
      modelName,
      modifiedInstruction,
      text,
      "json_object",
    );

    if (utils.resultIsInvalid(result)) {
      throw new Error("Unable to generate data.");
    }

    return JSON.parse<TData>(result, true);
  }

  public static generateList<TData>(
    modelName: string,
    instruction: string,
    text: string,
    sample: TData,
  ): TData[] {
    // Prompt trick: ask for a simple JSON object containing a list.
    // Note, OpenAI will not generate an array of objects directly.
    const modifiedInstruction =
      "Only respond with valid JSON object containing a valid JSON array named 'list', in this format:\n" +
      '{"list":[' +
      JSON.stringify(sample) +
      "]}\n" +
      instruction;

    const result = host.invokeTextGenerator(
      modelName,
      modifiedInstruction,
      text,
      "json_object",
    );

    if (utils.resultIsInvalid(result)) {
      throw new Error("Unable to generate data.");
    }

    const jsonList = JSON.parse<Map<string, TData[]>>(result, true);
    return jsonList.get("list");
  }
}
