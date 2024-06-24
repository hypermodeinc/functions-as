import { Model } from "@hypermode/models-as";

// This is a custom model class that provides an interface to the distilbert model
// used in this example.  It will likely work with other classification models hosted
// on Hypermode. It may be moved to a library in the future so it's built-in.

export class ClassifierModel extends Model<ClassifierInput, ClassifierOutput> {
  createInput(instances: string[]): ClassifierInput {
    return <ClassifierInput>{ instances };
  }
}


@json
class ClassifierInput {
  instances!: string[];
}


@json
class ClassifierOutput {
  predictions!: ClassifierResult[];
}


@json
export class ClassifierResult {
  label!: string;
  confidence!: f32;
  probabilities!: ClassifierLabel[];
}


@json
class ClassifierLabel {
  label!: string;
  probability!: f32;
}

/*

{
  "predictions": [
    {
      "label": "SPAM",
      "confidence": 0.5656777024269104,
      "probabilities": [
        { "label": "NOT-SPAM", "probability": 0.4343222975730896 },
        { "label": "SPAM", "probability": 0.5656777024269104 }
      ]
    }
  ]
}

 */
