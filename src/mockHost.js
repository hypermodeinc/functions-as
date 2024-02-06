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

    return this.newString('{"probabilities":[{"label":"A","probability":0.1},{"label":"B","probability":0.2}]}');
  }

  getImports() {
    return {
      executeDQL: this.executeDQL.bind(this),
      executeGQL: this.executeGQL.bind(this),
      invokeClassifier: this.invokeClassifier.bind(this),
    }
  }

  setInstance(instance) {
    this.getString = instance.exports.__getString;
    this.newString = instance.exports.__newString;
  }
}
