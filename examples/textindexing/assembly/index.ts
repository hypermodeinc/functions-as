import { inference, collections } from "@hypermode/functions-as";

// This model name should match one defined in the hypermode.json manifest file.
const modelName: string = "my-custom-embedding";
const collectionName: string = "myCollection";
const searchMethods: string[] = ["searchMethod1"];

// This function takes input text and returns the vector embedding for that text.
export function embed(text: string): f64[] {
  return inference.getTextEmbedding(modelName, text);
}

export function testUpsertText(text: string): string {
  const response = collections.upsertToTextIndex(collectionName, null, text);
  if (response.mutation !== null) {
    if (response.mutation.status !== "success") {
      throw new Error("Failed to upsert text");
    }
    return response.mutation.id;
  } else {
    throw new Error("Mutation result is null");
  }
}

export function testDeleteText(id: string): string {
  const response = collections.deleteFromTextIndex(collectionName, id);
  if (response.mutation !== null) {
    return response.mutation.status;
  } else {
    throw new Error("Mutation result is null");
  }
}

export function testSearchText(
  text: string,
): collections.TextIndexSearchResultObject[] {
  const response = collections.searchTextIndex(
    collectionName,
    searchMethods[0],
    text,
    10,
  );
  if (response.query !== null) {
    if (response.query.status !== "success") {
      throw new Error("Failed to search text");
    }
    return response.query.objects;
  } else {
    throw new Error("Query result is null");
  }
}

export function searchAndUpsertText(
  text: string,
): collections.TextIndexOperationResult {
  return collections.searchTextIndex(
    collectionName,
    searchMethods[0],
    text,
    10,
    "cosine",
    true,
  );
}

export function testRecomputeIndex(): string {
  const response = collections.recomputeTextIndex(
    collectionName,
    searchMethods[0],
  );
  if (response.mutation !== null) {
    return response.mutation.status;
  } else {
    throw new Error("Mutation result is null");
  }
}
