import { inference } from "@hypermode/functions-as";
import { JSON } from "json-as";

// This model name should match one defined in the hypermode.json manifest file.
const modelName: string = "my-custom-embedding";

// This function takes input text and returns the vector embedding for that text.
export function testEmbedding(text: string): f64[] {
  return inference.getTextEmbedding(modelName, text);
}

// This function is similar to the previous, but allows multiple vector embeddings
// to be calculated at a time.
export function testEmbeddings(ids: string, texts: string): EmbeddingObject[] {
  // Presently, Hypermode doesn't support array inputs,
  // So we'll pass arrays as JSON strings, example: '["id1", "id2"]'
  // In the future, Hypermode will support array inputs, and this will be simplified.
  const idArr = JSON.parse<string[]>(ids);
  const textArr = JSON.parse<string[]>(texts);
  const textMap = new Map<string, string>();
  for (let i = 0; i < idArr.length; i++) {
    textMap.set(idArr[i], textArr[i]);
  }

  // Get the embeddings for the input text
  const response = inference.getTextEmbeddings(modelName, textMap);

  // Transform the response into an array of EmbeddingObjects
  const resultObjs: EmbeddingObject[] = [];
  for (let i = 0; i < idArr.length; i++) {
    resultObjs.push({
      id: idArr[i],
      text: textArr[i],
      embedding: response.get(idArr[i]),
    });
  }

  return resultObjs;
}

// This class is used by the previous function
class EmbeddingObject {
  id!: string;
  text!: string;
  embedding!: f64[];
}
