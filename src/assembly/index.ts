import * as host from "./hypermode";
import { DQLResponse, DQLMutationResponse } from "./dqltypes";
import { GQLResponse } from "./gqltypes";
import { JSON } from "json-as";

const UNCERTAIN_LABEL = "uncertain";
const UNCERTAIN_PROBABILITY = 1.0;

export abstract class dql {
    public static mutate(query: string): DQLResponse<DQLMutationResponse> {
        return this.execute<DQLMutationResponse>(query, true);
    }

    public static query<TData>(query: string): DQLResponse<TData> {
        return this.execute<TData>(query, false);
    }

    private static execute<TData>(query: string, isMutation: bool): DQLResponse<TData> {
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
    public static max(arr: ClassificationProbability[]): ClassificationProbability {
        let max = arr[0];
        for (let i = 1; i < arr.length; i++) {
            if (arr[i].probability > max.probability) {
                max = arr[i];
            }
        }
        return max;
    }

    public static min(arr: ClassificationProbability[]): ClassificationProbability {
        let min = arr[0];
        for (let i = 1; i < arr.length; i++) {
            if (arr[i].probability < min.probability) {
                min = arr[i];
            }
        }
        return min;
    }

    public static checkUncertaintyRange(arr: ClassificationProbability[], min: f32, 
        max: f32): ClassificationProbability {

        for (let i = 1; i < arr.length; i++) {
            if (arr[i].probability < min || arr[i].probability > max) {
                return this.max(arr);
            }
        }
        let uncertain = <ClassificationProbability>({
            label: UNCERTAIN_LABEL,
            probability: UNCERTAIN_PROBABILITY
        });
        return uncertain;
    }
}

// @ts-ignore
@json
class ClassificationProbability { // must be defined in the library
  label!: string;
  probability!: f32;
};

// @ts-ignore
@json
class ClassificationResult { // must be defined in the library
  probabilities!: ClassificationProbability[]
};
