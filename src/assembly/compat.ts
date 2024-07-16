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

/**
 * @deprecated Import `graphql`, and use `graphql.Variables` instead.
 */
export class QueryVariables {
  private qv: graphql.Variables = new graphql.Variables();

  public set<T>(name: string, value: T): void {
    this.qv.set(name, value);
  }

  public toJSON(): string {
    return this.qv.toJSON();
  }
}
