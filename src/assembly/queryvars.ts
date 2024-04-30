import { Variant } from "as-variant/assembly";
import { JSON } from "json-as";

export class QueryVariables {
  private variables: Map<string, Variant> = new Map<string, Variant>();

  public set<T>(name: string, value: T): void {
    this.variables.set(name, Variant.from(value));
  }

  public toJSON(): string {
    /*
    The following would be ideal but is not currently supported:
      
        return JSON.stringify(this.variables);
    
    See https://github.com/JairusSW/as-json/issues/64
    Instead, we have to manually create a JSON string.
    */
    const segments: string[] = [];

    const keys = this.variables.keys();
    const values = this.variables.values();

    for (let i = 0; i < this.variables.size; i++) {
      const key = JSON.stringify(keys[i]);
      const value = values[i];

      switch (value.id) {
        // Simple types
        case Variant.idof<string>():
          segments.push(`${key}:${JSON.stringify(value.get<string>())}`);
          break;
        case Variant.idof<bool>():
          segments.push(`${key}:${JSON.stringify(value.get<bool>())}`);
          break;
        case Variant.idof<f64>():
          segments.push(`${key}:${JSON.stringify(value.get<f64>())}`);
          break;
        case Variant.idof<f32>():
          segments.push(`${key}:${JSON.stringify(value.get<f32>())}`);
          break;
        case Variant.idof<i64>():
          segments.push(`${key}:${JSON.stringify(value.get<i64>())}`);
          break;
        case Variant.idof<i32>():
          segments.push(`${key}:${JSON.stringify(value.get<i32>())}`);
          break;
        case Variant.idof<i16>():
          segments.push(`${key}:${JSON.stringify(value.get<i16>())}`);
          break;
        case Variant.idof<i8>():
          segments.push(`${key}:${JSON.stringify(value.get<i8>())}`);
          break;
        case Variant.idof<u64>():
          segments.push(`${key}:${JSON.stringify(value.get<u64>())}`);
          break;
        case Variant.idof<u32>():
          segments.push(`${key}:${JSON.stringify(value.get<u32>())}`);
          break;
        case Variant.idof<u16>():
          segments.push(`${key}:${JSON.stringify(value.get<u16>())}`);
          break;
        case Variant.idof<u8>():
          segments.push(`${key}:${JSON.stringify(value.get<u8>())}`);
          break;

        // Arrays of simple types
        case Variant.idof<string[]>():
          segments.push(`${key}:${JSON.stringify(value.get<string[]>())}`);
          break;
        case Variant.idof<bool[]>():
          segments.push(`${key}:${JSON.stringify(value.get<bool[]>())}`);
          break;
        case Variant.idof<f64[]>():
          segments.push(`${key}:${JSON.stringify(value.get<f64[]>())}`);
          break;
        case Variant.idof<f32[]>():
          segments.push(`${key}:${JSON.stringify(value.get<f32[]>())}`);
          break;
        case Variant.idof<i64[]>():
          segments.push(`${key}:${JSON.stringify(value.get<i64[]>())}`);
          break;
        case Variant.idof<i32[]>():
          segments.push(`${key}:${JSON.stringify(value.get<i32[]>())}`);
          break;
        case Variant.idof<i16[]>():
          segments.push(`${key}:${JSON.stringify(value.get<i16[]>())}`);
          break;
        case Variant.idof<i8[]>():
          segments.push(`${key}:${JSON.stringify(value.get<i8[]>())}`);
          break;
        case Variant.idof<u64[]>():
          segments.push(`${key}:${JSON.stringify(value.get<u64[]>())}`);
          break;
        case Variant.idof<u32[]>():
          segments.push(`${key}:${JSON.stringify(value.get<u32[]>())}`);
          break;
        case Variant.idof<u16[]>():
          segments.push(`${key}:${JSON.stringify(value.get<u16[]>())}`);
          break;
        case Variant.idof<u8[]>():
          segments.push(`${key}:${JSON.stringify(value.get<u8[]>())}`);
          break;

        default:
          throw new Error(
            "Query variables must be simple types, or arrays of simple types.",
          );
      }
    }

    return `{${segments.join(",")}}`;
  }
}
