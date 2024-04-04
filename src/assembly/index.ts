import * as host from "./hypermode";
import { DQLResponse, DQLMutationResponse } from "./dqltypes";
import { GQLResponse } from "./gqltypes";
import { QueryParameters } from "./queryparams";
import { inference } from "./inference";
import { JSON } from "json-as";

export { QueryParameters };
export { inference };

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
