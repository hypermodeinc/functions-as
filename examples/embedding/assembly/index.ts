import { models } from "@hypermode/functions-as";
import { EmbeddingsModel } from "@hypermode/models-as/models/openai/embeddings";

// In this example, we will create an embedding vector representing the input text.
// See https://platform.openai.com/docs/api-reference/embeddings for more details
// about the options available on the model, which you can set on the input object.

// This model name should match the one defined in the hypermode.json manifest file.
const modelName: string = "openai-embeddings";

export function testEmbeddings(text: string): f64[] {
  const model = models.getModel<EmbeddingsModel>(modelName);
  const input = model.createInput(text);
  const output = model.invoke(input);

  return output.data[0].embedding;
}
