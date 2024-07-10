import * as db from "./database";
import {
  PositionalParams as Params,
  Response,
  QueryResponse,
  ScalarResponse,
} from "./database";

export { Params, Response, QueryResponse, ScalarResponse };

const dbType = "postgresql";

export function execute(
  hostName: string,
  statement: string,
  params: Params = new Params(),
): Response {
  return db.execute(hostName, dbType, statement, params);
}

export function query<T>(
  hostName: string,
  statement: string,
  params: Params = new Params(),
): QueryResponse<T> {
  return db.query<T>(hostName, dbType, statement, params);
}

export function queryScalar<T>(
  hostName: string,
  statement: string,
  params: Params = new Params(),
): ScalarResponse<T> {
  return db.queryScalar<T>(hostName, dbType, statement, params);
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

  /* eslint-disable @typescript-eslint/no-unused-vars */
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
