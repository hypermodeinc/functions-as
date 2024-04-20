import { QueryParameters } from "./queryparams";
import { DQLResponse, DQLMutationResponse } from "./types/dqltypes";
import * as host from "./hypermode";
import { JSON } from "json-as";

export abstract class dql {
  public static mutate(
    hostName: string,
    query: string,
    parameters: QueryParameters = new QueryParameters(),
  ): DQLResponse<DQLMutationResponse> {
    return this.execute<DQLMutationResponse>(hostName, true, query, parameters);
  }

  public static query<TData>(
    hostName: string,
    query: string,
    parameters: QueryParameters = new QueryParameters(),
  ): DQLResponse<TData> {
    return this.execute<TData>(hostName, false, query, parameters);
  }

  private static execute<TData>(
    hostName: string,
    isMutation: bool,
    query: string,
    parameters: QueryParameters,
  ): DQLResponse<TData> {
    const paramsJson = parameters.toJSON();
    const response = host.executeDQL(hostName, query, paramsJson, isMutation);
    return JSON.parse<DQLResponse<TData>>(response);
  }
}
