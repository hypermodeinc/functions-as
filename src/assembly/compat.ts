import { QueryVariables } from "./queryvars";
import { execute, GQLResponse } from "./graphql";

// This file retains compatibility with previous function versions.

/**
 * @deprecated Import `graphql` instead.
 */
export abstract class connection {
  /**
   * @deprecated Use `graphql.execute` instead.
   */
  static invokeGraphqlApi<TData>(
    hostName: string,
    statement: string,
    variables: QueryVariables = new QueryVariables(),
  ): GQLResponse<TData> {
    return execute<TData>(hostName, statement, variables);
  }
}
