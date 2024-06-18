import { inference, collections } from "@hypermode/functions-as";
import { starterEmojis, getEmojiFromString } from "./emojis";

// This model name should match one defined in the hypermode.json manifest file.
const embeddingModelName: string = "my-custom-embedding";
const generationModelName: string = "text-generator";
const emojis: string = "emojis";
const searchMethod: string = "searchMethod1";

// This function takes input text and returns the vector embedding for that text.
export function embed(text: string): f64[] {
  return inference.getTextEmbedding(embeddingModelName, text);
}

export function generateEmojiDescriptions(): string[] {
  let allEmojis: string[] = [];
  const batchSize: i32 = 10;
  for (let i: i32 = 0; i < starterEmojis.length; i += batchSize) {
    const end: i32 = min(i + batchSize, starterEmojis.length);
    const batch: string[] = starterEmojis.slice(i, end);

    const emojiList = inference.generateList<string>(
      generationModelName,
      "write the emoji. It must precisely follow the sample",
      batch.join(" "),
      "😭: sobbing face.",
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
  const emojitext = inference.generateText(
    generationModelName,
    "generate a concise one sentence description for the emoji sent",
    emoji,
  );
  const upsertString = emoji + " " + emojitext;
  const response = collections.upsert(emojis, null, upsertString);
  if (response.status !== "success") {
    return response.error;
  }
  return response.status;
}

export function updateEmoji(
  id: string,
  emoji: string,
  emojiText: string,
): string {
  const text = collections.getText(emojis, id);
  const textEmoji = getEmojiFromString(text);
  if (textEmoji !== emoji) {
    return "Emoji does not match";
  }

  const upsertString = emoji + ": " + emojiText;
  const response = collections.upsert(emojis, id, upsertString);
  if (response.status !== "success") {
    return response.error;
  }
  return response.status;
}

export function getEmoji(id: string): string {
  const text = collections.getText(emojis, id);
  return getEmojiFromString(text);
}

export function findMatchingEmoji(
  emojiDescription: string,
): collections.CollectionSearchResult {
  return collections.search(emojis, searchMethod, emojiDescription, 5, true);
}

export function recomputeIndex(): string {
  const response = collections.recomputeSearchMethod(emojis, searchMethod);
  if (response.status !== "success") {
    return response.error;
  }
  return response.status;
}
