import * as utils from "./utils";

export type CollectionStatus = string;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CollectionStatus {
  export const Success = "success";
  export const Error = "error";
}
abstract class CollectionResult {
  collection: string;
  status: CollectionStatus;
  error: string;
  get isSuccessful(): bool {
    return this.status == CollectionStatus.Success;
  }

  constructor(collection: string, status: CollectionStatus, error: string) {
    this.collection = collection;
    this.status = status;
    this.error = error;
  }
}
export class CollectionMutationResult extends CollectionResult {
  operation: string;
  keys: string[] = [];

  constructor(
    collection: string,
    status: CollectionStatus,
    error: string,
    operation: string,
  ) {
    super(collection, status, error);
    this.operation = operation;
  }
}
export class SearchMethodMutationResult extends CollectionResult {
  operation: string;
  searchMethod: string;

  constructor(
    collection: string,
    status: CollectionStatus,
    error: string,
    operation: string,
    searchMethod: string,
  ) {
    super(collection, status, error);
    this.operation = operation;
    this.searchMethod = searchMethod;
  }
}
export class CollectionSearchResult extends CollectionResult {
  searchMethod: string;
  objects: CollectionSearchResultObject[];

  constructor(
    collection: string,
    status: CollectionStatus,
    error: string,
    searchMethod: string,
    objects: CollectionSearchResultObject[],
  ) {
    super(collection, status, error);
    this.searchMethod = searchMethod;
    this.objects = objects;
  }
}

export class CollectionSearchResultObject {
  key: string;
  text: string;
  distance: f64;
  score: f64;

  constructor(key: string, text: string, distance: f64, score: f64) {
    this.key = key;
    this.text = text;
    this.distance = distance;
    this.score = score;
  }
}

export class CollectionClassificationResult extends CollectionResult {
  searchMethod: string;
  label: string;
  labelsResult: string[];
  cluster: CollectionClassificationResultObject[];

  constructor(
    collection: string,
    status: CollectionStatus,
    error: string,
    searchMethod: string,
    label: string,
    labelsResult: string[],
    cluster: CollectionClassificationResultObject[],
  ) {
    super(collection, status, error);
    this.searchMethod = searchMethod;
    this.label = label;
    this.labelsResult = labelsResult;
    this.cluster = cluster;
  }
}

export class CollectionClassificationResultObject {
  key: string;
  label: string;
  distance: f64;
  score: f64;

  constructor(key: string, label: string, distance: f64, score: f64) {
    this.key = key;
    this.label = label;
    this.distance = distance;
    this.score = score;
  }
}

// @ts-expect-error: decorator
@external("hypermode", "upsertToCollection")
declare function hostUpsertToCollection(
  collection: string,
  keys: string[],
  texts: string[],
  labels: string[],
): CollectionMutationResult;

// @ts-expect-error: decorator
@external("hypermode", "deleteFromCollection")
declare function hostDeleteFromCollection(
  collection: string,
  key: string,
): CollectionMutationResult;

// @ts-expect-error: decorator
@external("hypermode", "searchCollection")
declare function hostSearchCollection(
  collection: string,
  searchMethod: string,
  text: string,
  limit: i32,
  returnText: bool,
): CollectionSearchResult;

// @ts-expect-error: decorator
@external("hypermode", "zsClassifyCollection")
declare function hostZSClassifyCollection(
  collection: string,
  searchMethod: string,
  text: string,
): CollectionClassificationResult;

// @ts-expect-error: decorator
@external("hypermode", "recomputeSearchMethod")
declare function hostRecomputeSearchMethod(
  collection: string,
  searchMethod: string,
): SearchMethodMutationResult;

// @ts-expect-error: decorator
@external("hypermode", "computeDistance")
declare function hostComputeDistance(
  collection: string,
  searchMethod: string,
  key1: string,
  key2: string,
): CollectionSearchResultObject;

// @ts-expect-error: decorator
@external("hypermode", "getTextFromCollection")
declare function hostGetTextFromCollection(
  collection: string,
  key: string,
): string;

// @ts-expect-error: decorator
@external("hypermode", "getTextsFromCollection")
declare function hostGetTextsFromCollection(
  collection: string,
): Map<string, string>;

// add batch upsert
export function upsertBatch(
  collection: string,
  keys: string[] | null,
  texts: string[],
  labels: string[] = [],
): CollectionMutationResult {
  if (collection.length == 0) {
    console.error("Collection is empty.");
    return new CollectionMutationResult(
      collection,
      CollectionStatus.Error,
      "Collection is empty.",
      "upsert",
    );
  }
  if (texts.length == 0) {
    console.error("Texts is empty.");
    return new CollectionMutationResult(
      collection,
      CollectionStatus.Error,
      "Texts is empty.",
      "upsert",
    );
  }
  let keysArr: string[] = [];
  if (keys != null) {
    keysArr = keys;
  }

  const result = hostUpsertToCollection(collection, keysArr, texts, labels);
  if (utils.resultIsInvalid(result)) {
    console.error("Error upserting to Text index.");
    return new CollectionMutationResult(
      collection,
      CollectionStatus.Error,
      "Error upserting to Text index.",
      "upsert",
    );
  }
  return result;
}

// add data to in-mem storage, get all embedders for a collection, run text through it
// and insert the Text into the Text indexes for each search method
export function upsert(
  collection: string,
  key: string | null,
  text: string,
  label: string = "",
): CollectionMutationResult {
  if (collection.length == 0) {
    console.error("Collection is empty.");
    return new CollectionMutationResult(
      collection,
      CollectionStatus.Error,
      "Collection is empty.",
      "upsert",
    );
  }
  if (text.length == 0) {
    console.error("Text is empty.");
    return new CollectionMutationResult(
      collection,
      CollectionStatus.Error,
      "Text is empty.",
      "upsert",
    );
  }
  const keys: string[] = [];
  if (key != null) {
    keys.push(key);
  }

  const texts: string[] = [text];

  const labels: string[] = [];
  if (label !== "") {
    labels.push(label);
  }

  const result = hostUpsertToCollection(collection, keys, texts, labels);
  if (utils.resultIsInvalid(result)) {
    console.error("Error upserting to Text index.");
    return new CollectionMutationResult(
      collection,
      CollectionStatus.Error,
      "Error upserting to Text index.",
      "upsert",
    );
  }
  return result;
}

// remove data from in-mem storage and indexes
export function remove(
  collection: string,
  key: string,
): CollectionMutationResult {
  if (collection.length == 0) {
    console.error("Collection is empty.");
    return new CollectionMutationResult(
      collection,
      CollectionStatus.Error,
      "Collection is empty.",
      "delete",
    );
  }
  if (key.length == 0) {
    console.error("Key is empty.");
    return new CollectionMutationResult(
      collection,
      CollectionStatus.Error,
      "Key is empty.",
      "delete",
    );
  }
  const result = hostDeleteFromCollection(collection, key);
  if (utils.resultIsInvalid(result)) {
    console.error("Error deleting from Text index.");
    return new CollectionMutationResult(
      collection,
      CollectionStatus.Error,
      "Error deleting from Text index.",
      "delete",
    );
  }
  return result;
}

// fetch embedders for collection & search method, run text through it and
// search Text index for similar Texts, return the result keys
// open question: how do i return a more expansive result from string array
export function search(
  collection: string,
  searchMethod: string,
  text: string,
  limit: i32,
  returnText: bool = false,
): CollectionSearchResult {
  if (text.length == 0) {
    console.error("Text is empty.");
    return new CollectionSearchResult(
      collection,
      CollectionStatus.Error,
      "Text is empty.",
      searchMethod,
      [],
    );
  }
  const result = hostSearchCollection(
    collection,
    searchMethod,
    text,
    limit,
    returnText,
  );
  if (utils.resultIsInvalid(result)) {
    console.error("Error searching Text index.");
    return new CollectionSearchResult(
      collection,
      CollectionStatus.Error,
      "Error searching Text index.",
      searchMethod,
      [],
    );
  }
  return result;
}

// fetch embedders for collection & search method, run text through it and
// classify Text index for similar Texts, return the result keys
export function zsClassify(
  collection: string,
  searchMethod: string,
  text: string,
): CollectionClassificationResult {
  if (text.length == 0) {
    console.error("Text is empty.");
    return new CollectionClassificationResult(
      collection,
      CollectionStatus.Error,
      "Text is empty.",
      searchMethod,
      "",
      [],
      [],
    );
  }
  const result = hostZSClassifyCollection(collection, searchMethod, text);
  if (utils.resultIsInvalid(result)) {
    console.error("Error classifying Text index.");
    return new CollectionClassificationResult(
      collection,
      CollectionStatus.Error,
      "Error classifying Text index.",
      searchMethod,
      "",
      [],
      [],
    );
  }
  return result;
}

export function recomputeSearchMethod(
  collection: string,
  searchMethod: string,
): SearchMethodMutationResult {
  if (collection.length == 0) {
    console.error("Collection is empty.");
    return new SearchMethodMutationResult(
      collection,
      CollectionStatus.Error,
      "Collection is empty.",
      "recompute",
      searchMethod,
    );
  }
  if (searchMethod.length == 0) {
    console.error("Search method is empty.");
    return new SearchMethodMutationResult(
      collection,
      CollectionStatus.Error,
      "Search method is empty.",
      "recompute",
      searchMethod,
    );
  }
  const result = hostRecomputeSearchMethod(collection, searchMethod);
  if (utils.resultIsInvalid(result)) {
    console.error("Error recomputing Text index.");
    return new SearchMethodMutationResult(
      collection,
      CollectionStatus.Error,
      "Error recomputing Text index.",
      "recompute",
      searchMethod,
    );
  }
  return result;
}

/**
 * @deprecated Use `collections.computeDistance` instead.
 */
export function computeSimilarity(
  collection: string,
  searchMethod: string,
  key1: string,
  key2: string,
): CollectionSearchResultObject {
  return computeDistance(collection, searchMethod, key1, key2);
}

export function computeDistance(
  collection: string,
  searchMethod: string,
  key1: string,
  key2: string,
): CollectionSearchResultObject {
  if (collection.length == 0) {
    console.error("Collection is empty.");
    return new CollectionSearchResultObject("", "", 0.0, 0.0);
  }
  if (searchMethod.length == 0) {
    console.error("Search method is empty.");
    return new CollectionSearchResultObject("", "", 0.0, 0.0);
  }
  if (key1.length == 0) {
    console.error("Key1 is empty.");
    return new CollectionSearchResultObject("", "", 0.0, 0.0);
  }
  if (key2.length == 0) {
    console.error("Key2 is empty.");
    return new CollectionSearchResultObject("", "", 0.0, 0.0);
  }
  return hostComputeDistance(collection, searchMethod, key1, key2);
}

export function getText(collection: string, key: string): string {
  if (collection.length == 0) {
    console.error("Collection is empty.");
    return "";
  }
  if (key.length == 0) {
    console.error("Key is empty.");
    return "";
  }
  return hostGetTextFromCollection(collection, key);
}

export function getTexts(collection: string): Map<string, string> {
  if (collection.length == 0) {
    console.error("Collection is empty.");
    return new Map<string, string>();
  }
  return hostGetTextsFromCollection(collection);
}
