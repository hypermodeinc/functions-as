import { inference } from "@hypermode/functions-as";
import { JSON } from "json-as";

// This model name should match one defined in the hypermode.json manifest file.
const modelName: string = "my_custom_classifier";

// This function takes input text and a probability threshold, and returns the
// classification label determined by the model.
export function classifyText(text: string, threshold: f32): string {
  return inference.classifyText(modelName, text, threshold);
}

// This function takes input text and returns the classification labels and their
// corresponding probabilities, as determined by the model.
export function getClassificationLabels(text: string): Map<string, f32> {
  return inference.getClassificationLabelsForText(modelName, text);
}

// This function is similar to the previous, but allows multiple items to be
// classified at a time.
export function getMultipleClassificationLabels(
  ids: string,
  texts: string,
): Map<string, Map<string, f32>> {
  // Presently, Hypermode doesn't support array inputs,
  // So we'll pass arrays as JSON strings, example: '["id1", "id2"]'
  // In the future, Hypermode will support array inputs, and this will be simplified.
  const idArr = JSON.parse<string[]>(ids);
  const textArr = JSON.parse<string[]>(texts);
  const textMap = new Map<string, string>();
  for (let i = 0; i < idArr.length; i++) {
    textMap.set(idArr[i], textArr[i]);
  }

  return inference.getClassificationLabelsForTexts(modelName, textMap);
}
