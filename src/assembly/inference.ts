import * as host from "./hypermode";
import { JSON } from "json-as";

export abstract class inference {
  public static computeClassificationProbablity(
    modelName: string,
    text: string,
    label: string,
  ): f32 {
    const labels = this.computeClassificationLabelsForText(modelName, text);
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
    const labels = this.computeClassificationLabelsForText(modelName, text);

    const keys = labels.keys();
    let max = labels.get(keys[0]);
    let result = "";
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

  public static computeClassificationLabelsForText(
    modelName: string,
    text: string,
  ): Map<string, f32> {
    const textMap = new Map<string, string>();
    textMap.set("text", text);
    const res = this.computeClassificationLabelsForTexts(modelName, textMap);
    return res.get("text");
  }

  public static computeClassificationLabelsForTexts(
    modelName: string,
    texts: Map<string, string>,
  ): Map<string, Map<string, f32>> {
    const response = host.invokeClassifier(modelName, JSON.stringify(texts));
    return JSON.parse<Map<string, Map<string, f32>>>(response);
  }

  public static embedText(modelName: string, text: string): f64[] {
    const textMap = new Map<string, string>();
    textMap.set("text", text);
    const res = this.embedTexts(modelName, textMap);
    return res.get("text");
  }

  public static embedTexts(
    modelName: string,
    texts: Map<string, string>,
  ): Map<string, f64[]> {
    const response = host.computeEmbedding(modelName, JSON.stringify(texts));
    return JSON.parse<Map<string, f64[]>>(response);
  }

  public static generateText(
    modelName: string,
    instruction: string,
    prompt: string,
  ): string {
    return host.invokeTextGenerator(modelName, instruction, prompt, "text");
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

    const generated = host.invokeTextGenerator(
      modelName,
      modifiedInstruction,
      text,
      "json_object",
    );

    return JSON.parse<TData>(generated, true);
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

    const generated = host.invokeTextGenerator(
      modelName,
      modifiedInstruction,
      text,
      "json_object",
    );

    const jsonList = JSON.parse<Map<string, TData[]>>(generated, true);
    return jsonList.get("list");
  }
}
