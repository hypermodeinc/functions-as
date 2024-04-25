import * as host from "./hypermode";
import * as utils from "./utils";
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
    if (utils.resultIsInvalid(response)) {
      throw new Error("Error invoking GraphQL API.");
    }

    const results = JSON.parse<GQLResponse<TData>>(response);
    if (results.errors) {
      console.error("GraphQL API Errors:" + JSON.stringify(results.errors));
    }
    return results;
  }
}
