/* eslint-disable @typescript-eslint/no-unused-vars */
export default class MockHost {
  executeDQL(pStatement, pVariables, isMutation) {
    const statement = this.getString(pStatement);
    const variables = this.getString(pVariables);

    if (isMutation) {
      throw new Error(`Unmocked DQL Mutation: ${statement}`);
    } else {
      switch (statement) {
        case "ping":
          return this.newString('{"data":"pong"}');
      }

      throw new Error(`Unmocked DQL Query: ${statement}`);
    }
  }

  executeGQL(pStatement, pVariables) {
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
            "probabilities": \
            [ \
              {"label":"A","probability":0.1}, \
              {"label":"B","probability":0.2} \
            ] \
          }, \
          "text2": \
          { \
            "probabilities": \
            [ \
              {"label":"A","probability":0.2}, \
              {"label":"B","probability":0.3} \
            ] \
          } \
      }',
    );
  }

  computeEmbedding(pModelId, pSentence) {
    const modelId = this.getString(pModelId);
    const sentence = this.getString(pSentence);

    return this.newString(
      '{"text": "[0.1, 0.2, 0.3]", "text2": "[0.2, 0.3, 0.4]"}',
    );
  }

  invokeTextGenerator(pModelId, pInstruction, pSentence) {
    const modelId = this.getString(pModelId);
    const instruction = this.getString(pInstruction);
    const sentence = this.getString(pSentence);

    return this.newString(
      '{"choices": [ {"message": {"role": "assistant", "content": ' +
        JSON.stringify(sentence) +
        "}}]}",
    );
  }

  getImports() {
    return {
      executeDQL: this.executeDQL.bind(this),
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
