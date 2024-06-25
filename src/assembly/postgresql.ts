import * as utils from "./utils";
import { JSON } from "json-as";

const datasourceType = "postgresql";

// @ts-expect-error: decorator
@external("hypermode", "databaseQuery")
declare function databaseQuery(
  hostName: string,
  dbType: string,
  query: string,
  paramsJson: string,
): hostResponse;

class hostResponse {
  error!: string;
  resultJson!: string;
  rowsAffected!: u32;
}

export class Point {
  constructor(
    public x: f64,
    public y: f64,
  ) {}

  public toString(): string {
    return `(${this.x}, ${this.y})`;
  }

  public static fromString(data: string): Point | null {
    if (!data.startsWith("(") || !data.endsWith(")")) {
      console.error(`Invalid Point string: "${data}"`);
      return null;
    }

    const parts = data.substring(1, data.length - 1).split(",");
    if (parts.length != 2) {
      console.error(`Invalid Point string: "${data}"`);
      return null;
    }

    const x = parseFloat(parts[0].trim());
    const y = parseFloat(parts[1].trim());
    return new Point(x, y);
  }

  // The following methods are required for custom JSON serialization
  // This is used in lieu of the @json decorator, so that the class can be
  // serialized to a string in PostgreSQL format.

  __INITIALIZE(): this {
    return this;
  }

  __SERIALIZE(): string {
    return this.toString();
  }

  // @ts-ignore unused parameters
  __DESERIALIZE(
    data: string,
    key_start: i32,
    key_end: i32,
    value_start: i32,
    value_end: i32,
  ): boolean {
    if (
      data.length < 7 ||
      data.charAt(0) != '"' ||
      data.charAt(data.length - 1) != '"'
    ) {
      return false;
    }

    const p = Point.fromString(data.substring(1, data.length - 1));
    if (!p) {
      return false;
    }

    this.x = p.x;
    this.y = p.y;
    return true;
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
  hostName: string,
  query: string,
  params: Params = new Params(),
): Response<T> {
  const paramsJson = params.toJSON();
  const response = databaseQuery(
    hostName,
    datasourceType,
    query.trim(),
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
