import { Model } from "@hypermode/models-as";

// This is a custom model class that provides an interface to the MiniLM model
// used in this example.  It will likely work with other embedding models hosted
// on Hypermode. It may be moved to a library in the future so it's built-in.

export class EmbeddingsModel extends Model<EmbeddingsInput, EmbeddingsOutput> {
  createInput(instances: string[]): EmbeddingsInput {
    return <EmbeddingsInput>{ instances };
  }
}


@json
class EmbeddingsInput {
  instances!: string[];
}


@json
class EmbeddingsOutput {
  predictions!: f64[][];
}
