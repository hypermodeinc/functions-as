import { dql } from "@hypermode/functions-as";
import { PeopleData, Person } from "./classes";

// This host name should match one defined in the hypermode.json manifest file.
const hostName: string = "dgraph";

export function dropAll(): string {
  return dql.dropAll(hostName);
}

export function dropAttr(attr: string): string {
  return dql.dropAttr(hostName, attr);
}

export function alterSchema(): string {
  const schema = `
  firstName: string @index(term) .
  lastName: string @index(term) .
  dgraph.type: [string] @index(exact) .

  type Person {
      firstName
      lastName
  }
  `;
  return dql.alterSchema(hostName, schema);
}

// This function returns the results of querying for all people in the database.
export function queryPeople(): Person[] | null {
  const query = `
  {
    people(func: type(Person)) {
      uid
      firstName
      lastName
    }
  }
  `;

  return dql.query<PeopleData>(hostName, query).people;
}

// This function returns the results of querying for a specific person in the database.
export function querySpecificPerson(
  firstName: string,
  lastName: string,
): Person | null {
  const statement = `
  query queryPerson($firstName: string, $lastName: string) {
    people(func: eq(firstName, $firstName)) @filter(eq(lastName, $lastName)) {
      uid
      firstName
      lastName
    }
  }
  `;

  const vars = new dql.Variables();
  vars.set("firstName", firstName);
  vars.set("lastName", lastName);

  const people = dql.query<PeopleData>(hostName, statement, vars).people;

  if (people.length === 0) return null;
  return people[0];
}

// This function adds a new person to the database and returns that person.
export function addPerson(
  firstName: string,
  lastName: string,
): Map<string, string> {
  const mutation = `
  _:user1 <firstName> "${firstName}" .
  _:user1 <lastName> "${lastName}" .
  _:user1 <dgraph.type> "Person" .
  `;

  const mutations: string[] = [mutation];

  return dql.mutate(hostName, mutations);
}

export function deletePerson(uid: string): Map<string, string> {
  const mutation = `<${uid}> * * .`;

  const mutations: string[] = [mutation];

  return dql.mutate(hostName, [], mutations);
}

// This function demonstrates what happens when a bad query is executed.
export function testBadQuery(): Person[] {
  const query = "this is a bad query";
  return dql.query<PeopleData>(hostName, query).people;
}
