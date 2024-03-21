// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck: decorators are allowed on function exports in AssemblyScript

// This file should only export functions from the "hypermode" host module.

export declare function executeDQL(
  statement: string,
  variables: string,
  isMutation: bool,
): string;

export declare function executeGQL(
  statement: string,
  variables: string,
): string;

export declare function invokeClassifier(
  modelId: string,
  sentenceMap: string,
): string;

export declare function computeEmbedding(
  modelId: string,
  sentenceMap: string,
): string;

export declare function invokeTextGenerator_v2(
  modelId: string,
  instruction: string,
  sentence: string,
  format: string,
): string;
