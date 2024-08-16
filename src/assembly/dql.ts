import { JSON } from "json-as";
import * as utils from "./utils";
import { NamedParams as Variables } from "./database";
export { Variables };

// @ts-expect-error: decorator
@external("hypermode", "executeDQLQuery")
declare function hostExecuteDQLQuery(
  hostName: string,
  query: string,
  variables: string,
): string;

// @ts-expect-error: decorator
@external("hypermode", "executeDQLMutations")
declare function hostExecuteDQLMutations(
  hostName: string,
  setMutations: string[],
  delMutations: string[],
): Map<string, string>;

// @ts-expect-error: decorator
@external("hypermode", "alterSchema")
declare function hostAlterSchema(hostName: string, schema: string): string;

// @ts-expect-error: decorator
@external("hypermode", "dropAttr")
declare function hostDropAttr(hostName: string, attr: string): string;

// @ts-expect-error: decorator
@external("hypermode", "dropAll")
declare function hostDropAll(hostName: string): string;

export function query<TData>(
  hostName: string,
  query: string = "",
  variables: Variables = new Variables(),
): TData {
  const varsJson = variables.toJSON();
  const response = hostExecuteDQLQuery(hostName, query, varsJson);
  if (utils.resultIsInvalid(response)) {
    throw new Error("Error running DQL query.");
  }

  return JSON.parse<TData>(response);
}

export function mutate(
  hostName: string,
  setMutations: string[] = [],
  delMutations: string[] = [],
): Map<string, string> {
  return hostExecuteDQLMutations(hostName, setMutations, delMutations);
}

export function alterSchema(hostName: string, schema: string): string {
  const response = hostAlterSchema(hostName, schema);
  if (utils.resultIsInvalid(response)) {
    throw new Error("Error invoking DQL.");
  }

  return response;
}

export function dropAttr(hostName: string, attr: string): string {
  const response = hostDropAttr(hostName, attr);
  if (utils.resultIsInvalid(response)) {
    throw new Error("Error invoking DQL.");
  }

  return response;
}

export function dropAll(hostName: string): string {
  const response = hostDropAll(hostName);
  if (utils.resultIsInvalid(response)) {
    throw new Error("Error invoking DQL.");
  }

  return response;
}
