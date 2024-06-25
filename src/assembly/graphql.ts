import * as utils from "./utils";
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
  variables: Variables = new Variables(),
): Response<TData> {
  const varsJson = variables.toJSON();
  const response = executeGQL(hostName, statement, varsJson);
  if (utils.resultIsInvalid(response)) {
    throw new Error("Error invoking GraphQL API.");
  }

  const results = JSON.parse<Response<TData>>(response);
  if (results.errors) {
    console.error("GraphQL API Errors:" + JSON.stringify(results.errors));
  }
  return results;
}

export class Variables {
  private data: Map<string, string> = new Map<string, string>();

  public set<T>(name: string, value: T): void {
    this.data.set(name, JSON.stringify(value));
  }

  public toJSON(): string {
    const segments: string[] = [];
    const keys = this.data.keys();
    const values = this.data.values();

    for (let i = 0; i < this.data.size; i++) {
      const key = JSON.stringify(keys[i]);
      const value = values[i]; // already in JSON
      segments.push(`${key}:${value}`);
    }

    return `{${segments.join(",")}}`;
  }
}


@json
export class Response<T> {
  errors: ErrorResult[] | null = null;
  data: T | null = null;
  // extensions: Map<string, ???> | null = null;
}


@json
class ErrorResult {
  message!: string;
  locations: CodeLocation[] | null = null;
  path: string[] | null = null;
  // extensions: Map<string, ???> | null = null;
}


@json
class CodeLocation {
  line!: u32;
  column!: u32;
}
