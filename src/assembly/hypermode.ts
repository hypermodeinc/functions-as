// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck: decorators are allowed on function exports in AssemblyScript

// This file should only export functions from the "hypermode" host module.

export declare function executeGQL(
  hostName: string,
  statement: string,
  variables: string,
): string;

export declare function invokeClassifier(
  modelName: string,
  sentenceMap: Map<string, string>,
): Map<string, Map<string, f32>>;

export declare function computeEmbedding(
  modelName: string,
  sentenceMap: Map<string, string>,
): Map<string, f64[]>;

export declare function invokeTextGenerator(
  modelName: string,
  instruction: string,
  sentence: string,
  format: string,
): string;

export class VectorIndexActionResult {
  status: string;
  action: string;
  name: string;
}

export class VectorIndexOperationResult {
  mutation: VectorIndexMutationResult;
  query: VectorIndexSearchResult;
}

export class VectorIndexMutationResult {
  status: string;
  operation: string;
  id: string;
  vector: f64[];
}

export class VectorIndexSearchResult {
  status: string;
  objects: VectorIndexSearchResultObject[];
}

export class VectorIndexSearchResultObject {
  id: string;
  score: f64;
}

export declare function createVectorIndex(
  vectorIndexName: string,
  indexType: string,
): VectorIndexActionResult;

export declare function removeVectorIndex(
  vectorIndexName: string,
): VectorIndexActionResult;

export declare function insertToVectorIndex(
  vectorIndexName: string,
  id: string,
  vector: f64[],
): VectorIndexOperationResult;

export declare function searchVectorIndex(
  vectorIndexName: string,
  vector: f64[],
  limit: i32,
): VectorIndexOperationResult;

export declare function deleteFromVectorIndex(
  vectorIndexName: string,
  id: string,
): VectorIndexOperationResult;
