// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck: decorators are allowed on function exports in AssemblyScript

// This file should only export functions from the "hypermode" host module.

export declare function executeDQL(
  hostName: string,
  statement: string,
  parameters: string,
  isMutation: bool,
): string;

export declare function executeGQL(
  hostName: string,
  statement: string,
  parameters: string,
): string;

export declare function invokeClassifier(
  modelName: string,
  sentenceMap: string,
): string;

export declare function computeEmbedding(
  modelName: string,
  sentenceMap: string,
): string;

export declare function invokeTextGenerator(
  modelId: string,
  instruction: string,
  sentence: string,
  format: string,
): string;

export declare function fetchGet(
  hostName: string,
  statement: string,
): string;
