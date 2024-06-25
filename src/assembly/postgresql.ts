import { JSON } from "json-as";

// @ts-expect-error: decorator
@external("hypermode", "databaseQuery")
declare function databaseQuery(
  datasourceName: string,
  datasourceType: string,
  query: string,
  paramsJson: string,
): string;

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
  public rows!: T[];
}

export function query<T>(
  datasourceName: string,
  query: string,
  params: Params = new Params(),
): Response<T> {
  const datasourceType = "postgresql";

  const respHost = databaseQuery(
    datasourceName,
    datasourceType,
    query,
    params.toJSON(),
  );

  const parsedResp = JSON.parse<hostResponse>(respHost);
  if (parsedResp.error != "") {
    throw new Error(parsedResp.error);
  }

  const resp = new Response<T>();
  resp.rows = JSON.parse<T[]>(parsedResp.result);
  return resp;
}


@json
class hostResponse {
  error!: string;
  result!: string;
}
