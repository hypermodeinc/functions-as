import * as host from "./hypermode";
import { QueryParameters } from "./queryparams";
import { GQLResponse } from "./types/gqltypes";
import { JSON } from "json-as";

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
