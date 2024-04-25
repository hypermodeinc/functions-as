// We need this import for some reason or we get a compile error. Probably a bug in json-as.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JSON } from "json-as";


@json
export class GQLResponse<T> {
  errors: GQLError[] | null = null;
  data: T | null = null;
  // extensions: Map<string, ???> | null = null;
}


@json
class GQLError {
  message!: string;
  locations: GQLErrorLocation[] | null = null;
  path: string[] | null = null;
  // extensions: Map<string, ???> | null = null;
}


@json
class GQLErrorLocation {
  line!: u32;
  column!: u32;
}
