import { dgraph } from "@hypermode/functions-as";
import { PeopleData, Person } from "./classes";

// This host name should match one defined in the hypermode.json manifest file.
const hostName: string = "dgraph";

export function dropAll(): string {
  return dgraph.dropAll(hostName);
}

export function dropAttr(attr: string): string {
  return dgraph.dropAttr(hostName, attr);
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
  return dgraph.alterSchema(hostName, schema);
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

  return dgraph.query<PeopleData>(hostName, query).people;
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

  const vars = new dgraph.Variables();
  vars.set("$firstName", firstName);
  vars.set("$lastName", lastName);

  const people = dgraph.query<PeopleData>(hostName, statement, vars).people;

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

  return dgraph.mutate(hostName, mutations);
}

export function upsertPerson(
  nameToChangeFrom: string,
  nameToChangeTo: string,
): Map<string, string> {
  const query = `
  query {
    person as var(func: eq(firstName, "${nameToChangeFrom}"))
  `;
  const mutation = `
    uid(person) <firstName> "${nameToChangeTo}" .`;

  const mutations: string[] = [mutation];

  return dgraph.upsert(hostName, query, mutations);
}

export function deletePerson(uid: string): Map<string, string> {
  const mutation = `<${uid}> * * .`;

  const mutations: string[] = [mutation];

  return dgraph.mutate(hostName, [], mutations);
}

// This function demonstrates what happens when a bad query is executed.
export function testBadQuery(): Person[] {
  const query = "this is a bad query";
  return dgraph.query<PeopleData>(hostName, query).people;
}
