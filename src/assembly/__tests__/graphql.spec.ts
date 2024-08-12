import { expect, it, mockImport, run } from "as-test";
import { graphql } from "..";
import { JSON } from "json-as";

let returnData: string = "";
mockImport("hypermode.executeGQL", (hostName: string, statement: string, variables: string): string => {
    return returnData;
});

it("should execute graphql query", () => {
    const statement = `
    query {
      people: queryPerson {
        id
        firstName
        lastName
      }
    }
  `;

  returnData = "{\"data\":{\"people\":[]}}";

  const response = graphql.execute<PeopleData>("dgraph", statement);
  expect(!response.data).toBe(false);
  expect(!response.data!.people).toBe(false);
});

it("should query people", () => {
    const statement = `
    query {
      people: queryPerson {
        id
        firstName
        lastName
      }
    }
  `;

  const _person: Person = {
    id: "0xb8",
    firstName: "Jairus",
    lastName: "Tanaka"
  }

  returnData = "{\"data\":{\"people\":[" + JSON.stringify(_person) + "]}}";

  const response = graphql.execute<PeopleData>("dgraph", statement);
  expect(!response.data).toBe(false);
  expect(!response.data!.people).toBe(false);

  const person = response.data!.people[0];
  expect(person.id).toBe("0xb8");
  expect(person.firstName).toBe("Jairus");
  expect(person.lastName).toBe("Tanaka");
});

run();

@json
class Person {
  id: string | null = null;
  firstName: string = "";
  lastName: string = "";
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
