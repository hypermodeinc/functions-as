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
@external("hypermode", "dgraphAlterSchema")
declare function hostDgraphAlterSchema(
  hostName: string,
  schema: string,
): string;

// @ts-expect-error: decorator
@external("hypermode", "dgraphDropAttr")
declare function hostDgraphDropAttr(hostName: string, attr: string): string;

// @ts-expect-error: decorator
@external("hypermode", "dgraphDropAll")
declare function hostDgraphDropAll(hostName: string): string;

/**
 *
 * executes a dql query on the dgraph database
 *
 * @param hostName - the name of the host
 * @param query - the dql query to execute
 * @param variables - the variables to use in the query
 * @returns The result as a JSON object of type TData, specified by the caller
 */
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

/**
 *
 * executes a dql mutation on the dgraph database
 *
 * @param hostName - the name of the host
 * @param setMutations - the set mutations to execute, written in dql in rdf format
 * @param delMutations - the delete mutations to execute, written in dql in rdf format
 * @returns A map of the uids returned, or an empty map if no uids are returned (usually for delete mutations)
 */
export function mutate(
  hostName: string,
  setMutations: string[] = [],
  delMutations: string[] = [],
): Map<string, string> {
  return hostExecuteDQLMutations(hostName, setMutations, delMutations);
}

/**
 *
 * Alters the schema of the dgraph database
 *
 * @param hostName - the name of the host
 * @param schema - the schema to alter
 * @returns The response from the Dgraph server
 */
export function alterSchema(hostName: string, schema: string): string {
  const response = hostDgraphAlterSchema(hostName, schema);
  if (utils.resultIsInvalid(response)) {
    throw new Error("Error invoking DQL.");
  }

  return response;
}

/**
 *
 * Drops an attribute from the schema.
 *
 * @param hostName - the name of the host
 * @param attr - the attribute to drop
 * @returns The response from the Dgraph server
 */
export function dropAttr(hostName: string, attr: string): string {
  const response = hostDgraphDropAttr(hostName, attr);
  if (utils.resultIsInvalid(response)) {
    throw new Error("Error invoking DQL.");
  }

  return response;
}

/**
 *
 * Drops all data from the database.
 *
 * @param hostName - the name of the host
 * @returns The response from the Dgraph server
 */
export function dropAll(hostName: string): string {
  const response = hostDgraphDropAll(hostName);
  if (utils.resultIsInvalid(response)) {
    throw new Error("Error invoking DQL.");
  }

  return response;
}
