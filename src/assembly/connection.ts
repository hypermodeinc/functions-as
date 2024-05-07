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

  public static fetch<TData>(hostName: string, request: HtttpRequest): TData {
    if (request.method != "POST" && request.body != "GET") {
      throw new Error("HttpRequest method muts be GET or POST");
    }
    // Convert the request object to a JSON string until runtime supports Object passing
    const response = host.fetch(
      hostName,
      request.method,
      request.path,
      request.body,
      request.headers,
    );
    return JSON.parse<TData>(response);
  }
}
/* HttpRequest class. Base url is provided by the host configuration.
 * The Request class is used to make HTTP requests to the host.
 * The host configuration is provided by the user in the hypermode.json file.
 * Security is handled by the host configuration.
 */
export class HtttpRequest {
  method: string = "GET";
  path: string = "";
  body: string = "";
  headers: Map<string, string> = new Map<string, string>();
}
