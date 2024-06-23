import { models } from "@hypermode/functions-as";
import { EmbeddingsModel as OpenAIEmbeddingsModel } from "@hypermode/models-as/models/openai/embeddings";
import { EmbeddingsModel } from "./model";

// In this example, we will create an embedding vector representing the input text.
// For comparison, we'll do this with two different models.

export function testEmbeddingsWithOpenAI(text: string): f64[] {
  // See https://platform.openai.com/docs/api-reference/embeddings for more details
  // about the options available on the model, which you can set on the input object.

  const model = models.getModel<OpenAIEmbeddingsModel>("openai-embeddings");
  const input = model.createInput(text);
  const output = model.invoke(input);

  return output.data[0].embedding;
}

export function testEmbeddingsWithMiniLM(text: string): f64[] {
  // For now, we've defined the model interface in the model.ts file.
  // This may be moved to a library in the future so it's built-in.
  const model = models.getModel<EmbeddingsModel>("minilm");
  const input = model.createInput([text]);
  const output = model.invoke(input);

  return output.predictions[0];
}
