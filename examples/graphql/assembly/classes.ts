// For now, this import is required when we use @json, even if we're not calling
// methods on the JSON class.  It will be fixed in the future.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JSON } from "json-as";


@json
export class Person {
  id: string | null = null;
  firstName: string = "";
  lastName: string = "";
}


@json
export class PeopleData {
  people!: Person[];
}


@json
export class AddPersonPayload {
  addPerson!: PeopleData;
}


@json
export class AggregatePersonResult {
  aggregatePerson!: GQLAggregateValues;
}


@json
class GQLAggregateValues {
  count: u32 = 0;
}
