import * as utils from "./utils";
import { JSON } from "json-as";

const datasourceType = "postgresql";

// @ts-expect-error: decorator
@external("hypermode", "databaseQuery")
declare function databaseQuery(
  datasourceName: string,
  datasourceType: string,
  query: string,
  paramsJson: string,
): hostResponse;

class hostResponse {
  error!: string;
  resultJson!: string;
  rowsAffected!: u32;
}

export class Point {
  private X: f64;
  private Y: f64;

  constructor(X: f64, Y: f64) {
    this.X = X;
    this.Y = Y;
  }

  public toString(): string {
    return `(${this.X}, ${this.Y})`;
  }
}

export class Params {
  private data: string[] = [];

  public push<T>(val: T): void {
    this.data.push(JSON.stringify(val));
  }

  public toJSON(): string {
    return `[${this.data.join(",")}]`;
  }
}

export class Response<T> {
  error!: string;
  rows!: T[];
  rowsAffected!: u32;
}

export function query<T>(
  datasourceName: string,
  query: string,
  params: Params = new Params(),
): Response<T> {
  const paramsJson = params.toJSON();
  const response = databaseQuery(
    datasourceName,
    datasourceType,
    query,
    paramsJson,
  );

  if (utils.resultIsInvalid(response)) {
    throw new Error("Error performing PostgreSQL query.");
  }

  if (response.error) {
    console.error("PostgreSQL Error: " + response.error);
  }

  const results: Response<T> = {
    error: response.error,
    rows: JSON.parse<T[]>(response.resultJson),
    rowsAffected: response.rowsAffected,
  };

  return results;
}
