import { JSON } from "json-as";
import {
  connection,
  inference,
  QueryParameters,
} from "@hypermode/functions-as";

export function add(a: i32, b: i32): i32 {
  return a + b;
}

const dgraph_host: string = "dgraph";
const classifier_model: string = "hmplugin1_classifier_custom";
const hmplugin1_embedding_custom: string = "hmplugin1_embedding_custom";
const openai_generator_model: string = "hmplugin1_openai";

export function getFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`;
}

export function getPeople(): Person[] {
  const people = [
    <Person>{ firstName: "Bob", lastName: "Smith" },
    <Person>{ firstName: "Alice", lastName: "Jones" },
  ];

  people.forEach((p) => p.updateFullName());
  return people;
}

export function queryPeopleWithVars(
  firstName: string,
  lastName: string,
): Person[] {
  const query = `
    query peopleWithVars($firstName: string, $lastName: string) {
      people(func: eq(Person.firstName, $firstName)) @filter(eq(Person.lastName, $lastName)) {
        id: uid
        firstName: Person.firstName
        lastName: Person.lastName
      }
    }
  `;

  const parameters = new QueryParameters();
  parameters.set("$firstName", firstName);
  parameters.set("$lastName", lastName);

    query,
  const response = connection.invokeGraphqlApi<PeopleData>(
    dgraph_host,
    parameters,
  );
  const people = response.data.people;
  people.forEach((p) => p.updateFullName());
  return people;
}

export function queryPeople(): Person[] {
  const statement = `
    query {
      people: queryPerson {
        id
        firstName
        lastName
      }
    }
  `;

  const results = connection.invokeGraphqlApi<PeopleData>(
    dgraph_host,
    statement,
  );
  return results.data.people;
}

export function newPerson(
  hostName: string,
  firstName: string,
  lastName: string,
): Person {
  const statement = `
    mutation {
      addPerson(input: [{firstName: "${firstName}", lastName: "${lastName}" }]) {
        people: person {
          id
          firstName
          lastName
        }
      }
    }
  `;

  const response = connection.invokeGraphqlApi<AddPersonPayload>(
    hostName,
    statement,
  );
  const person = response.data.addPerson.people[0];
  person.updateFullName();
  return person;
}

function getPersonCount(): i32 {
  const statement = `
    query {
      aggregatePerson {
        count
      }
    }
  `;

  const response = connection.invokeGraphqlApi<AggregatePersonResult>(
    dgraph_host,
    statement,
  );
  return response.data.aggregatePerson.count;
}

export function getRandomPerson(): Person {
  const count = getPersonCount();
  const offset = <u32>Math.floor(Math.random() * count);
  const statement = `
    query {
      people: queryPerson(first: 1, offset: ${offset}) {
        id
        firstName
        lastName
      }
    }
  `;

  const results = connection.invokeGraphqlApi<PeopleData>(
    dgraph_host,
    statement,
  );
  const person = results.data.people[0];
  person.updateFullName();
  return person;
}

export function testClassifier(text: string): Map<string, f32> {
  return inference.getClassificationLabelsForText(classifier_model, text);
}

export function testMultipleClassifier(
  ids: string,
  texts: string,
): Map<string, Map<string, f32>> {
  // convert ids to array
  const idArr = JSON.parse<string[]>(ids);
  // convert texts to array
  const textArr = JSON.parse<string[]>(texts);
  const textMap = new Map<string, string>();
  for (let i = 0; i < idArr.length; i++) {
    textMap.set(idArr[i], textArr[i]);
  }
  return inference.getClassificationLabelsForTexts(classifier_model, textMap);
}

export function testEmbedding(text: string): string {
  return JSON.stringify(
    inference.getTextEmbedding(hmplugin1_embedding_custom, text),
  );
}

export function testEmbeddings(ids: string, texts: string): EmbeddingObject[] {
  // convert ids to array
  const idArr = JSON.parse<string[]>(ids);
  // convert texts to array
  const textArr = JSON.parse<string[]>(texts);
  const textMap = new Map<string, string>();
  for (let i = 0; i < idArr.length; i++) {
    textMap.set(idArr[i], textArr[i]);
  }
  const response = inference.getTextEmbeddings(
    hmplugin1_embedding_custom,
    textMap,
  );
  const resultObjs: EmbeddingObject[] = [];
  for (let i = 0; i < idArr.length; i++) {
    resultObjs.push({
      id: idArr[i],
      text: textArr[i],
      embedding: response.get(idArr[i]),
    });
  }
  return resultObjs;
}

export function testTextGenerator(instruction: string, text: string): string {
  return inference.generateText(openai_generator_model, instruction, text);
}


@json
class Person {
  id: string | null = null;
  firstName: string = "";
  lastName: string = "";
  fullName: string | null = null;

  updateFullName(): void {
    this.fullName = `${this.firstName} ${this.lastName}`;
  }
}


@json
class PeopleData {
  people!: Person[];
}


@json
class AddPersonPayload {
  addPerson!: PeopleData;
}


@json
class AggregatePersonResult {
  aggregatePerson!: GQLAggregateValues;
}


@json
class GQLAggregateValues {
  count: u32 = 0;
}


@json
class EmbeddingObject {
  id!: string;
  text!: string;
  embedding!: f64[];
}

export function testError(): void {
  console.log("hello");
  console.log("howdy");
  throw new Error("This is a test error");
}
