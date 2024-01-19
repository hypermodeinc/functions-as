import * as host from "./hypermode";
import { DQLResponse, DQLMutationResponse } from "./dqltypes";
import { GQLResponse } from "./gqltypes";
import { JSON } from "json-as";

const UNCERTAIN_LABEL = "UNCERTAIN";
const UNCERTAIN_PROBABILITY = f32(1.0);

export abstract class dql {
  public static mutate(query: string): DQLResponse<DQLMutationResponse> {
    return this.execute<DQLMutationResponse>(query, true);
  }

  public static query<TData>(query: string): DQLResponse<TData> {
    return this.execute<TData>(query, false);
  }

  private static execute<TData>(
    query: string,
    isMutation: bool,
  ): DQLResponse<TData> {
    const response = host.executeDQL(query, isMutation);
    return JSON.parse<DQLResponse<TData>>(response);
  }
}

export abstract class graphql {
  static execute<TData>(statement: string): GQLResponse<TData> {
    const response = host.executeGQL(statement);
    return JSON.parse<GQLResponse<TData>>(response);
  }
}

export abstract class model {
  public static classify(modelId: string, text: string): ClassificationResult {
    const response = host.invokeClassifier(modelId, text);
    return JSON.parse<ClassificationResult>(response);
  }
}

export abstract class classifier {
  public static getMaxProbability(
    res: ClassificationResult,
    threshold: f32 = 0.0,
  ): ClassificationProbability {
    const probabilities = res.probabilities;
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
  ): ClassificationProbability {
    const probabilities = res.probabilities;
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
  // must be defined in the library
  label!: string;
  probability!: f32;
}


@json
class ClassificationResult {
  // must be defined in the library
  probabilities!: ClassificationProbability[];
}
