// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck: decorators are allowed on function exports in AssemblyScript

// This file should only export functions from the "hypermode" host module.

export declare function executeDQL(
  statement: string,
  parameters: string,
  isMutation: bool,
): string;

export declare function executeGQL(
  statement: string,
  parameters: string,
): string;

export declare function invokeClassifier(
  modelId: string,
  sentenceMap: string,
): string;

export declare function computeEmbedding(
  modelId: string,
  sentenceMap: string,
): string;


@external("invokeTextGenerator_v2")
export declare function invokeTextGenerator(
  modelId: string,
  instruction: string,
  sentence: string,
  format: string,
): string;
