import * as host from "./hypermode";
import { DQLResponse, DQLMutationResponse } from "./dqltypes";
import { GQLResponse } from "./gqltypes";
import { QueryParameters } from "./queryparams";
import { JSON } from "json-as";

export { QueryParameters };

const UNCERTAIN_LABEL = "UNCERTAIN";
const UNCERTAIN_PROBABILITY = f32(1.0);

export abstract class connection {}

export abstract class dql {
  public static mutate(
    query: string,
    parameters: QueryParameters = new QueryParameters(),
  ): DQLResponse<DQLMutationResponse> {
    return this.execute<DQLMutationResponse>(true, query, parameters);
  }

  public static query<TData>(
    query: string,
    parameters: QueryParameters = new QueryParameters(),
  ): DQLResponse<TData> {
    return this.execute<TData>(false, query, parameters);
  }

  private static execute<TData>(
    isMutation: bool,
    query: string,
    parameters: QueryParameters,
  ): DQLResponse<TData> {
    const paramsJson = parameters.toJSON();
    const response = host.executeDQL(query, paramsJson, isMutation);
    return JSON.parse<DQLResponse<TData>>(response);
  }
}

export abstract class graphql {
  static execute<TData>(
    statement: string,
    parameters: QueryParameters = new QueryParameters(),
  ): GQLResponse<TData> {
    const paramsJson = parameters.toJSON();
    const response = host.executeGQL(statement, paramsJson);
    return JSON.parse<GQLResponse<TData>>(response);
  }
}

export abstract class inference {
  public static computeClassificationProbablity(
    modelName: string,
    text: string,
    label: string,
  ): f32 {
    const labels = this.computeClassificationLabelsForText(modelName, text);
    const keys = labels.keys();
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
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
      let key = keys[i];
      let value = labels.get(key);
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
    const classificationResult =
      JSON.parse<Map<string, ClassificationResult>>(response);

    const result = new Map<string, Map<string, f32>>();

    const keys = classificationResult.keys();
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let value = classificationResult.get(key);
      const valueMap = new Map<string, f32>();
      for (let j = 0; j < value.probabilities.length; j++) {
        valueMap.set(
          value.probabilities[j].label,
          value.probabilities[j].probability,
        );
      }
      result.set(key, valueMap);
    }

    return result;
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
  static extractChatFirstMessageContent(response: string): string {
    const resp = JSON.parse<ChatResponse>(response);
    let output = "";
    if (resp.choices != null) {
      const choices = resp.choices as MessageChoice[];
      if (choices.length > 0) output = choices[0].message.content;
    }
    return output;
  }

  public static generateText(
    modelName: string,
    instruction: string,
    prompt: string,
  ): string {
    const response = host.invokeTextGenerator(
      modelName,
      instruction,
      prompt,
      "text",
    );

    return this.extractChatFirstMessageContent(response);
  }

  public static generate<TData>(
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

    const response = this.extractChatFirstMessageContent(generated);
    return JSON.parse<TData>(response, true);
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

    const response = this.extractChatFirstMessageContent(generated);
    const jsonList = JSON.parse<Map<string, TData[]>>(response, true);
    return jsonList.get("list");
  }
}


@json
export class ClassificationProbability {
  label: string;
  probability: f32;

  constructor(label: string, probability: f32) {
    this.label = label;
    this.probability = probability;
  }
}


@json
export class ClassificationResult {
  probabilities!: ClassificationProbability[];
}


@json
export class ChatMessage {
  role!: string;
  content!: string;
}


@json
export class MessageChoice {
  message!: ChatMessage;
}


@json
export class ChatResponse {
  choices: MessageChoice[] | null = null;
}
/* response can also be error
"error": {
  "message": "We could not parse the JSON body of your request. (HINT: This likely means you aren't using your HTTP library correctly. The OpenAI API expects a JSON payload, but what was sent was not valid JSON. If you have trouble figuring out how to fix this, please contact us through our help center at help.openai.com.)",
  "type": "invalid_request_error",
  "param": null,
  "code": null
}
*/
