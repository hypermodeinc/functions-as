import { graphql } from ".";

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
    variables = new graphql.Variables(),
  ): graphql.Response<TData> {
    return graphql.execute<TData>(hostName, statement, variables);
  }
}
