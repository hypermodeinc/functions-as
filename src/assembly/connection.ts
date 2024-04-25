import * as host from "./hypermode";
import { QueryVariables } from "./queryvars";
import { GQLResponse } from "./types/gqltypes";
import { JSON } from "json-as";

export abstract class connection {
  static invokeGraphqlApi<TData>(
    hostName: string,
    statement: string,
    variables: QueryVariables = new QueryVariables(),
  ): GQLResponse<TData> {
    const varsJson = variables.toJSON();
    const response = host.executeGQL(hostName, statement, varsJson);
    return JSON.parse<GQLResponse<TData>>(response);
  }
}
