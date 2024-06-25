import * as utils from "./utils";
import { QueryVariables } from "./queryvars";
import { JSON } from "json-as";

// @ts-expect-error: decorator
@external("hypermode", "executeGQL")
declare function executeGQL(
  hostName: string,
  statement: string,
  variables: string,
): string;

export function execute<TData>(
  hostName: string,
  statement: string,
  variables: QueryVariables = new QueryVariables(),
): GQLResponse<TData> {
  const varsJson = variables.toJSON();
  const response = executeGQL(hostName, statement, varsJson);
  if (utils.resultIsInvalid(response)) {
    throw new Error("Error invoking GraphQL API.");
  }

  const results = JSON.parse<GQLResponse<TData>>(response);
  if (results.errors) {
    console.error("GraphQL API Errors:" + JSON.stringify(results.errors));
  }
  return results;
}


@json
export class GQLResponse<T> {
  errors: GQLError[] | null = null;
  data: T | null = null;
  // extensions: Map<string, ???> | null = null;
}


@json
class GQLError {
  message!: string;
  locations: GQLErrorLocation[] | null = null;
  path: string[] | null = null;
  // extensions: Map<string, ???> | null = null;
}


@json
class GQLErrorLocation {
  line!: u32;
  column!: u32;
}
