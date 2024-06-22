import { collections } from "@hypermode/functions-as";
import { models } from "@hypermode/functions-as";
import { EmbeddingsModel } from "@hypermode/models-as/models/openai/embeddings";

// These names should match the ones defined in the hypermode.json manifest file.
const modelName: string = "embeddings";
const myProducts: string = "myProducts";
const searchMethods: string[] = ["searchMethod1", "searchMethod2"];

// This function takes input text and returns the vector embedding for that text.
export function embed(text: string): f64[] {
  const model = models.getModel<EmbeddingsModel>(modelName);
  const input = model.createInput(text);
  const output = model.invoke(input);
  return output.data[0].embedding;
}

export function addProduct(description: string): string {
  const response = collections.upsert(myProducts, null, description);
  if (!response.isSuccessful) {
    throw new Error(response.error);
  }
  return response.key;
}

export function deleteProduct(key: string): string {
  const response = collections.remove(myProducts, key);
  if (!response.isSuccessful) {
    throw new Error(response.error);
  }
  return response.status;
}

export function getProduct(key: string): string {
  return collections.getText(myProducts, key);
}

export function computeSimilarityBetweenProducts(
  key1: string,
  key2: string,
): f64 {
  return collections.computeSimilarity(myProducts, "searchMethod1", key1, key2)
    .score;
}

export function searchProducts(
  product: string,
  maxItems: i32,
): collections.CollectionSearchResult[] {
  const responseArr: collections.CollectionSearchResult[] = [];
  for (let i: i32 = 0; i < searchMethods.length; i++) {
    const response = collections.search(
      myProducts,
      searchMethods[i],
      product,
      maxItems,
      true,
    );
    responseArr.push(response);
  }
  return responseArr;
}

export function recomputeIndexes(): Map<string, string> {
  const responseArr: Map<string, string> = new Map<string, string>();
  for (let i: i32 = 0; i < searchMethods.length; i++) {
    const response = collections.recomputeSearchMethod(
      myProducts,
      searchMethods[i],
    );
    if (!response.isSuccessful) {
      responseArr.set(searchMethods[i], response.error);
    }
    responseArr.set(searchMethods[i], response.status);
  }
  return responseArr;
}
