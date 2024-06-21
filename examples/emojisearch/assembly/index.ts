import { collections } from "@hypermode/functions-as";
import { starterEmojis } from "./emojis";
import { models } from "@hypermode/functions-as";
import { EmbeddingsModel } from "@hypermode/models-as/models/openai/embeddings";
import {
  ChatModel,
  ResponseFormat,
  SystemMessage,
  UserMessage,
} from "@hypermode/models-as/models/openai/chat";
import { JSON } from "json-as";

// This model name should match one defined in the hypermode.json manifest file.
const embeddingModelName: string = "openai-embeddings";
const generationModelName: string = "text-generator";
const emojis: string = "emojis";
const searchMethod: string = "searchMethod1";

// This function takes input text and returns the vector embedding for that text.
export function embed(text: string): f64[] {
  const model = models.getModel<EmbeddingsModel>(embeddingModelName);
  const input = model.createInput(text);
  const output = model.invoke(input);
  return output.data[0].embedding;
}

export function getEmojiFromString(text: string): string {
  if (
    text.length >= 2 &&
    0xd800 <= text.charCodeAt(0) &&
    text.charCodeAt(0) <= 0xdbff
  ) {
    // The first character is a high surrogate, return the first two characters
    return text.substring(0, 2);
  } else {
    // The first character is not a high surrogate, return the first character
    return text.substring(0, 1);
  }
}

function generateList<TData>(
  instruction: string,
  text: string,
  sample: TData,
): TData[] {
  // Prompt trick: ask for a simple JSON object.
  const modifiedInstruction =
    "Only respond with valid JSON object in this format:\n" +
    JSON.stringify(sample) +
    "\n" +
    instruction;

  const model = models.getModel<ChatModel>(generationModelName);
  const input = model.createInput([
    new SystemMessage(modifiedInstruction),
    new UserMessage(text),
  ]);

  input.responseFormat = ResponseFormat.Json;

  const output = model.invoke(input);

  // The output should contain the JSON string we asked for.
  const json = output.choices[0].message.content.trim();

  return JSON.parse<TData[]>(json);
}

export function generateEmojiDescriptions(): string[] {
  let allEmojis: string[] = [];
  const batchSize: i32 = 10;
  for (let i: i32 = 0; i < starterEmojis.length; i += batchSize) {
    const end: i32 = min(i + batchSize, starterEmojis.length);
    const batch: string[] = starterEmojis.slice(i, end);

    const emojiList = generateList<string>(
      "write the emoji. It must precisely follow the sample",
      batch.join(" "),
      "😭: sobbing face",
    );

    allEmojis = allEmojis.concat(emojiList);
  }
  return allEmojis;
}

export function upsertAllStarterEmojis(): string {
  let response = "";
  const descriptions = generateEmojiDescriptions();
  for (let i: i32 = 0; i < descriptions.length; i++) {
    response = insertEmoji(descriptions[i]);
    if (response !== "success") {
      return response;
    }
  }
  return response;
}

function generateText(instruction: string, prompt: string): string {
  // The imported ChatModel interface follows the OpenAI Chat completion model input format.
  const model = models.getModel<ChatModel>(generationModelName);
  const input = model.createInput([
    new SystemMessage(instruction),
    new UserMessage(prompt),
  ]);

  // Here we invoke the model with the input we created.
  const output = model.invoke(input);

  // The output is also specific to the ChatModel interface.
  // Here we return the trimmed content of the first choice.
  return output.choices[0].message.content.trim();
}

export function insertEmoji(emoji: string): string {
  // check if emoji already exists
  const texts = collections.getTexts(emojis);
  for (let i: i32 = 0; i < texts.keys().length; i++) {
    const text = texts.get(texts.keys()[i]);
    const textEmoji = getEmojiFromString(text);
    if (textEmoji === emoji) {
      return "Emoji already exists";
    }
  }
  const emojitext = generateText(
    "generate a concise one sentence description for the emoji sent",
    emoji,
  );
  const upsertString = emoji + " " + emojitext;
  const response = collections.upsert(emojis, null, upsertString);
  if (!response.isSuccessful) {
    return response.error;
  }
  return response.status;
}

export function updateEmoji(
  key: string,
  emoji: string,
  emojiText: string,
): string {
  const text = collections.getText(emojis, key);
  const textEmoji = getEmojiFromString(text);
  if (textEmoji !== emoji) {
    return "Emoji does not match";
  }

  const upsertString = emoji + ": " + emojiText;
  const response = collections.upsert(emojis, key, upsertString);
  if (!response.isSuccessful) {
    return response.error;
  }
  return response.status;
}

export function getEmoji(key: string): string {
  const text = collections.getText(emojis, key);
  return getEmojiFromString(text);
}

export function findMatchingEmoji(
  emojiDescription: string,
): collections.CollectionSearchResult {
  return collections.search(emojis, searchMethod, emojiDescription, 5, true);
}

export function recomputeIndex(): string {
  const response = collections.recomputeSearchMethod(emojis, searchMethod);
  if (!response.isSuccessful) {
    return response.error;
  }
  return response.status;
}