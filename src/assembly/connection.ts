import * as host from "./hypermode";
import { QueryParameters } from "./queryparams";
import { GQLResponse } from "./types/gqltypes";
import { JSON } from "json-as";

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

  static invokeDgraphGraphqlApi<TData>(
    statement: string,
    parameters: QueryParameters = new QueryParameters(),
  ): GQLResponse<TData> {
    const paramsJson = parameters.toJSON();
    const response = host.executeDgraphGQL(statement, paramsJson);
    return JSON.parse<GQLResponse<TData>>(response);
  }
}
