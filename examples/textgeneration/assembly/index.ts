import { inference } from "@hypermode/functions-as";
import { Product, sampleProduct } from "./product";

// This model name should match the one defined in the hypermode.json manifest file.
const modelName: string = "text-generator";

// This function generates some text based on the instruction and prompt provided.
export function generateText(instruction: string, prompt: string): string {
  const text = inference.generateText(modelName, instruction, prompt);
  return text;
}

// This function generates a single product.
export function generateProduct(category: string): Product {
  const instruction = "Generate a product for the category provided.";
  const product = inference.generateData<Product>(
    modelName,
    instruction,
    category,
    sampleProduct,
  );

  return product;
}

// This function generates multiple products.
export function generateProducts(category: string, quantity: i32): Product[] {
  const instruction = `Generate ${quantity} products for the category provided.`;
  const products = inference.generateList<Product>(
    modelName,
    instruction,
    category,
    sampleProduct,
  );

  return products;
}
