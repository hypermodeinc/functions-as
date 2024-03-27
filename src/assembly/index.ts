import * as host from "./hypermode";
import { DQLResponse, DQLMutationResponse } from "./dqltypes";
import { GQLResponse } from "./gqltypes";
import { QueryParameters } from "./queryparams";
import { JSON } from "json-as";

export { QueryParameters };

const UNCERTAIN_LABEL = "UNCERTAIN";
const UNCERTAIN_PROBABILITY = f32(1.0);

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

export abstract class model {
  public static classifyText(
    modelId: string,
    text: string,
  ): ClassificationResult {
    const textMap = new Map<string, string>();
    textMap.set("text", text);
    const res = this.classifyTexts(modelId, textMap);
    return res.get("text");
  }

  public static classifyTexts(
    modelId: string,
    texts: Map<string, string>,
  ): Map<string, ClassificationResult> {
    const response = host.invokeClassifier(modelId, JSON.stringify(texts));
    return JSON.parse<Map<string, ClassificationResult>>(response);
  }

  public static computeTextEmbedding(modelId: string, text: string): f64[] {
    const textMap = new Map<string, string>();
    textMap.set("text", text);
    const res = this.computeTextEmbeddings(modelId, textMap);
    return res.get("text");
  }

  public static computeTextEmbeddings(
    modelId: string,
    texts: Map<string, string>,
  ): Map<string, f64[]> {
    const response = host.computeEmbedding(modelId, JSON.stringify(texts));
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
    modelId: string,
    instruction: string,
    text: string,
  ): string {
    const response = host.invokeTextGenerator(
      modelId,
      instruction,
      text,
      "text",
    );

    return this.extractChatFirstMessageContent(response);
  }

  public static generate<TData>(
    modelId: string,
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
      modelId,
      modifiedInstruction,
      text,
      "json_object",
    );

    const response = this.extractChatFirstMessageContent(generated);
    return JSON.parse<TData>(response, true);
  }

  public static generateList<TData>(
    modelId: string,
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
      modelId,
      modifiedInstruction,
      text,
      "json_object",
    );

    const response = this.extractChatFirstMessageContent(generated);
    const jsonList = JSON.parse<Map<string, TData[]>>(response, true);
    return jsonList.get("list");
  }
}

export abstract class classifier {
  public static getMaxProbability(
    res: ClassificationResult,
    threshold: f32 = 0.0,
  ): ClassificationProbability | null {
    const probabilities = res.probabilities;
    if (probabilities.length === 0) {
      return null;
    }
    let max = probabilities[0];
    for (let i = 1; i < probabilities.length; i++) {
      if (probabilities[i].probability > max.probability) {
        max = probabilities[i];
      }
    }
    if (max.probability < threshold) {
      return <ClassificationProbability>{
        label: UNCERTAIN_LABEL,
        probability: UNCERTAIN_PROBABILITY,
      };
    }
    return max;
  }

  public static getMinProbability(
    res: ClassificationResult,
    threshold: f32 = 1.0,
  ): ClassificationProbability | null {
    const probabilities = res.probabilities;
    if (probabilities.length === 0) {
      return null;
    }
    let min = probabilities[0];
    for (let i = 1; i < probabilities.length; i++) {
      if (probabilities[i].probability < min.probability) {
        min = probabilities[i];
      }
    }
    if (min.probability > threshold) {
      return <ClassificationProbability>{
        label: UNCERTAIN_LABEL,
        probability: UNCERTAIN_PROBABILITY,
      };
    }
    return min;
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
