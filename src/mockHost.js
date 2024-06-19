/* eslint-disable @typescript-eslint/no-unused-vars */

import console from "console";

export default class MockHost {
  log(pLevel, pMessage) {
    const level = this.getString(pLevel);
    const message = this.getString(pMessage);
    console.log(`[${level}] ${message}`);
  }

  executeGQL(pHostName, pStatement, pVariables) {
    const hostName = this.getString(pHostName);
    const statement = this.getString(pStatement);
    const variables = this.getString(pVariables);

    switch (statement) {
      case "ping":
        return this.newString('{"data":"pong"}');
    }

    throw new Error(`Unmocked GraphQL Query: ${statement}`);
  }

  invokeClassifier(pModelName, pSentenceMap) {
    const modelName = this.getString(pModelName);
    const sentenceMap = this.getString(pSentenceMap);

    return this.newString(
      '{ \
        "text": \
          { \
            "A": 0.1, \
            "B": 0.2 \
          }, \
        "text2": \
          { \
            "A": 0.2, \
            "B": 0.3 \
          } \
      }',
    );
  }

  computeEmbedding(pModelName, pSentenceMap) {
    const modelName = this.getString(pModelName);
    const sentenceMap = this.getString(pSentenceMap);

    return this.newString(
      '{"text": [0.1, 0.2, 0.3], "text2": [0.2, 0.3, 0.4]}',
    );
  }

  invokeTextGenerator(pModelName, pInstruction, pSentence, pFormat) {
    const modelName = this.getString(pModelName);
    const instruction = this.getString(pInstruction);
    const sentence = this.getString(pSentence);
    const format = this.getString(pFormat);

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

    return this.newString(response);
  }

  httpFetch(pRequest) {
    console.log("Not implemented: httpFetch");
    return 0;
  }

  lookupModel(pModelName) {
    const modelName = this.getString(pModelName);

    console.log("Not implemented: lookupModel");
    return 0;
  }

  invokeModel(pModelName, pInput) {
    const modelName = this.getString(pModelName);
    const input = this.getString(pInput);

    console.log("Not implemented: invokeModel");
    return 0;
  }

  getImports() {
    return {
      log: this.log.bind(this),
      executeGQL: this.executeGQL.bind(this),
      invokeClassifier: this.invokeClassifier.bind(this),
      computeEmbedding: this.computeEmbedding.bind(this),
      invokeTextGenerator: this.invokeTextGenerator.bind(this),
      httpFetch: this.httpFetch.bind(this),
      lookupModel: this.lookupModel.bind(this),
      invokeModel: this.invokeModel.bind(this),
    };
  }

  setInstance(instance) {
    this.getString = instance.exports.__getString;
    this.newString = instance.exports.__newString;
  }
}
