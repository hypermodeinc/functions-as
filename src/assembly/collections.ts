export class TextIndexOperationResult {
  collection!: string;
  mutation: TextIndexMutationResult | null = null;
  query: TextIndexSearchResult | null = null;
}

export class TextIndexMutationResult {
  status!: string;
  operation!: string;
  id!: string;
}

export class TextIndexSearchResult {
  status!: string;
  searchMethod!: string;
  objects!: TextIndexSearchResultObject[];
}

export class TextIndexSearchResultObject {
  id!: string;
  score!: f64;
}

// @ts-expect-error: decorator
@external("hypermode", "upsertToTextIndex")
declare function hostUpsertToTextIndex(
  collection: string,
  id: string | null,
  text: string,
): TextIndexOperationResult;

// @ts-expect-error: decorator
@external("hypermode", "deleteFromTextIndex")
declare function hostDeleteFromTextIndex(
  collection: string,
  id: string,
): TextIndexOperationResult;

// @ts-expect-error: decorator
@external("hypermode", "searchTextIndex")
declare function hostSearchTextIndex(
  collection: string,
  searchMethod: string,
  text: string,
  searchAlgorithm: string,
  limit: i32,
): TextIndexOperationResult;

// @ts-expect-error: decorator
@external("hypermode", "recomputeTextIndex")
declare function hostRecomputeTextIndex(
  collection: string,
  searchMethod: string,
): TextIndexOperationResult;

// add data to in-mem storage, get all embedders for a collection, run text through it
// and insert the Text into the Text indexes for each search method
export function upsertToTextIndex(
  collection: string,
  id: string | null,
  text: string,
): TextIndexOperationResult {
  return hostUpsertToTextIndex(collection, id, text);
}

// remove data from in-mem storage and indexes
export function deleteFromTextIndex(
  collection: string,
  id: string,
): TextIndexOperationResult {
  return hostDeleteFromTextIndex(collection, id);
}

// fetch embedders for collection & search method, run text through it and
// search Text index for similar Texts, return the result ids
// open question: how do i return a more expansive result from string array
export function searchTextIndex(
  collection: string,
  searchMethod: string,
  text: string,
  limit: i32,
  searchAlgorithm: string = "cosine",
  upsert: boolean = false,
): TextIndexOperationResult {
  let result = hostSearchTextIndex(
    collection,
    searchMethod,
    text,
    searchAlgorithm,
    limit,
  );
  if (upsert) {
    const upsertRes = upsertToTextIndex(collection, null, text);
    result.mutation = upsertRes.mutation;
  }
  return result;
}

export function recomputeTextColumn(
  collection: string,
  searchMethod: string,
): TextIndexOperationResult {
  return hostRecomputeTextIndex(collection, searchMethod);
}
