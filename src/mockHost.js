/* eslint-disable @typescript-eslint/no-unused-vars */
export default class MockHost {
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

  invokeClassifier(pModelId, pSentence) {
    const modelId = this.getString(pModelId);
    const sentence = this.getString(pSentence);

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

  computeEmbedding(pModelId, pSentence) {
    const modelId = this.getString(pModelId);
    const sentence = this.getString(pSentence);

    return this.newString(
      '{"text": [0.1, 0.2, 0.3], "text2": [0.2, 0.3, 0.4]}',
    );
  }

  invokeTextGenerator(pModelId, pInstruction, pSentence, pFormat) {
    const modelId = this.getString(pModelId);
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

  getImports() {
    return {
      executeGQL: this.executeGQL.bind(this),
      invokeClassifier: this.invokeClassifier.bind(this),
      computeEmbedding: this.computeEmbedding.bind(this),
      invokeTextGenerator: this.invokeTextGenerator.bind(this),
    };
  }

  setInstance(instance) {
    this.getString = instance.exports.__getString;
    this.newString = instance.exports.__newString;
  }
}
