// These classes are used by the example functions in the index.ts file.

@json
export class Person {
  uid: string | null = null;
  firstName: string = "";
  lastName: string = "";
}


@json
export class PeopleData {
  people!: Person[];
}
