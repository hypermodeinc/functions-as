import * as utils from "./utils";

export class TextIndexMutationResult {
  collection!: string;
  operation!: string;
  status!: string;
  id!: string;
  error!: string;
}

export class TextIndexSearchResult {
  collection!: string;
  searchMethod!: string;
  status!: string;
  objects!: TextIndexSearchResultObject[];
  error!: string;
}

export class TextIndexSearchResultObject {
  id!: string;
  text!: string;
  score!: f64;
}

// @ts-expect-error: decorator
@external("hypermode", "upsertToTextIndex")
declare function hostUpsertToTextIndex(
  collection: string,
  id: string | null,
  text: string,
): TextIndexMutationResult;

// @ts-expect-error: decorator
@external("hypermode", "deleteFromTextIndex")
declare function hostDeleteFromTextIndex(
  collection: string,
  id: string,
): TextIndexMutationResult;

// @ts-expect-error: decorator
@external("hypermode", "searchTextIndex")
declare function hostSearchTextIndex(
  collection: string,
  searchMethod: string,
  text: string,
  limit: i32,
  returnText: bool,
): TextIndexSearchResult;

// @ts-expect-error: decorator
@external("hypermode", "recomputeTextIndex")
declare function hostRecomputeTextIndex(
  collection: string,
  searchMethod: string,
): TextIndexMutationResult;

// @ts-expect-error: decorator
@external("hypermode", "getText")
declare function hostGetText(collection: string, id: string): string;

// add data to in-mem storage, get all embedders for a collection, run text through it
// and insert the Text into the Text indexes for each search method
export function upsertToTextIndex(
  collection: string,
  id: string | null,
  text: string,
): TextIndexMutationResult {
  const result = hostUpsertToTextIndex(collection, id, text);
  if (utils.resultIsInvalid(result)) {
    throw new Error("Error upserting to Text index.");
  }
  return result;
}

// remove data from in-mem storage and indexes
export function deleteFromTextIndex(
  collection: string,
  id: string,
): TextIndexMutationResult {
  const result = hostDeleteFromTextIndex(collection, id);
  if (utils.resultIsInvalid(result)) {
    throw new Error("Error deleting from Text index.");
  }
  return result;
}

// fetch embedders for collection & search method, run text through it and
// search Text index for similar Texts, return the result ids
// open question: how do i return a more expansive result from string array
export function searchTextIndex(
  collection: string,
  searchMethod: string,
  text: string,
  limit: i32,
  returnText: bool = false,
): TextIndexSearchResult {
  const result = hostSearchTextIndex(
    collection,
    searchMethod,
    text,
    limit,
    returnText,
  );
  if (utils.resultIsInvalid(result)) {
    throw new Error("Error searching Text index.");
  }
  return result;
}

export function recomputeTextIndex(
  collection: string,
  searchMethod: string,
): TextIndexMutationResult {
  const result = hostRecomputeTextIndex(collection, searchMethod);
  if (utils.resultIsInvalid(result)) {
    throw new Error("Error recomputing Text index.");
  }
  return result;
}

export function getText(collection: string, id: string): string {
  return hostGetText(collection, id);
}
