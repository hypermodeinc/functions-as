import { inference, collections } from "@hypermode/functions-as";

// This model name should match one defined in the hypermode.json manifest file.
const modelName: string = "my-custom-embedding";
const myProducts: string = "myProducts";
const searchMethods: string[] = ["searchMethod1"];

// This function takes input text and returns the vector embedding for that text.
export function embed(text: string): f64[] {
  return inference.getTextEmbedding(modelName, text);
}

export function upsertProduct(description: string): string {
  const response = collections.upsertToTextIndex(myProducts, null, description);
  if (response.status !== "success") {
    return response.error;
  }
  return response.id;
}

export function deleteProduct(id: string): string {
  const response = collections.deleteFromTextIndex(myProducts, id);
  if (response.status !== "success") {
    return response.error;
  }
  return response.status;
}

export function searchProducts(
  product: string,
): collections.TextIndexSearchResult[] {
  const responseArr: collections.TextIndexSearchResult[] = [];
  for (let i: i32 = 0; i < searchMethods.length; i++) {
    const response = collections.searchTextIndex(
      myProducts,
      searchMethods[i],
      product,
      10,
      true,
    );
    responseArr.push(response);
  }
  return responseArr;
}

export function recomputeIndexes(): string[] {
  const responseArr: string[] = [];
  for (let i: i32 = 0; i < searchMethods.length; i++) {
    const response = collections.recomputeTextIndex(
      myProducts,
      searchMethods[i],
    );
    if (response.status !== "success") {
      responseArr.push(response.error);
    }
    responseArr.push(response.status);
  }
  return responseArr;
}
