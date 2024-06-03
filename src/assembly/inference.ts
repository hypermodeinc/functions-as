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

  public static getTextEmbeddingAndIndex(
    modelName: string,
    text: string,
    collectionName: string,
  ): f64[] {
    const textMap = new Map<string, string>();
    textMap.set("text", text);
    const res = this.getTextEmbeddingsAndIndex(
      modelName,
      textMap,
      collectionName,
    );
    return res.get("text");
  }

  public static semanticSearchForText(
    modelName: string,
    text: string,
    collectionName: string,
    numResults: i32,
  ): string[] {
    const textMap = new Map<string, string>();
    textMap.set("text", text);
    const res = this.semanticSearchForTexts(
      modelName,
      textMap,
      collectionName,
      numResults,
    );
    return res.get("text");
  }

  public static getTextEmbeddingsAndIndex(
    modelName: string,
    texts: Map<string, string>,
    collectionName: string,
  ): Map<string, f64[]> {
    const result = host.embedAndIndex(modelName, texts, collectionName);
    if (utils.resultIsInvalid(result)) {
      throw new Error("Unable to compute embeddings and index.");
    }
    return result;
  }

  public static semanticSearchForTexts(
    modelName: string,
    texts: Map<string, string>,
    collectionName: string,
    numResults: i32,
  ): Map<string, string[]> {
    const result = host.embedAndSearchIndex(
      modelName,
      texts,
      collectionName,
      numResults,
    );
    if (utils.resultIsInvalid(result)) {
      throw new Error("Unable to compute embeddings and search index.");
    }
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
