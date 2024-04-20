import * as host from "./hypermode";
import { QueryParameters } from "./queryparams";
import { GQLResponse } from "./types/gqltypes";
import { JSON } from "json-as";
import { DQLResponse, DQLMutationResponse } from "./types/dqltypes";

export abstract class connection {
  static invokeGraphqlApi<TData>(
    hostName: string,
    statement: string,
    parameters: QueryParameters = new QueryParameters(),
  ): GQLResponse<TData> {
    const paramsJson = parameters.toJSON();
    const response = host.executeGQL(hostName, statement, paramsJson);
    return JSON.parse<GQLResponse<TData>>(response);
  }

  public static invokeDgraphDqlMutation(
    hostName: string,
    query: string,
    parameters: QueryParameters = new QueryParameters(),
  ): DQLResponse<DQLMutationResponse> {
    return this.invokeDQL<DQLMutationResponse>(
      hostName,
      true,
      query,
      parameters,
    );
  }

  public static invokeDgraphDqlQuery<TData>(
    hostName: string,
    query: string,
    parameters: QueryParameters = new QueryParameters(),
  ): DQLResponse<TData> {
    return this.invokeDQL<TData>(hostName, false, query, parameters);
  }

  private static invokeDQL<TData>(
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
