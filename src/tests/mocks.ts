export function log(level: string, message: string) {
    switch (level) {
        case "debug": {
            console.debug(message);
            break;
        }
        case "info": {
            console.info(message);
            break;
        }
        case "warning": {
            console.warn(message);
            break;
        }
        case "error": {
            console.error(message);
            break;
        }
    }
}

export function invokeTextGenerator(modelName: string, instruction: string, sentence: string, format: string) {
  let response;

  switch (format) {
    case "text":
      response = sentence;
      break;

    case "json_object":
      if (instruction.includes("JSON array")) {
        response = `{"list":[${sentence},${sentence}]}`;
      } else {
        response = sentence;
      }
      break;

    default:
      throw new Error(`Unknown format: ${format}`);
  }
  return response;
}
