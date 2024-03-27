import { Variant } from "as-variant/assembly";
import { JSON } from "json-as";

export class QueryParameters {
  private parameters: Map<string, Variant> = new Map<string, Variant>();

  public set<T>(name: string, value: T): void {
    this.parameters.set(name, Variant.from(value));
  }

  public toJSON(): string {
    /*
    The following would be ideal but is not currently supported:
      
        return JSON.stringify(this.parameters);
    
    See https://github.com/JairusSW/as-json/issues/64
    Instead, we have to manually create a JSON string.
    */
    const segments: string[] = [];

    const keys = this.parameters.keys();
    const values = this.parameters.values();

    for (let i = 0; i < this.parameters.size; i++) {
      const key = JSON.stringify(keys[i]);
      const value = values[i];

      if (value.is<string>()) {
        segments.push(`${key}:${JSON.stringify(value.get<string>())}`);
      } else if (value.is<bool>()) {
        segments.push(`${key}:${JSON.stringify(value.get<bool>())}`);
      } else if (value.is<i32>()) {
        segments.push(`${key}:${JSON.stringify(value.get<i32>())}`);
      } else if (value.is<u32>()) {
        segments.push(`${key}:${JSON.stringify(value.get<u32>())}`);
      } else if (value.is<i64>()) {
        segments.push(`${key}:${JSON.stringify(value.get<i64>())}`);
      } else if (value.is<f32>()) {
        segments.push(`${key}:${JSON.stringify(value.get<f32>())}`);
      } else if (value.is<f64>()) {
        segments.push(`${key}:${JSON.stringify(value.get<f64>())}`);
      } else if (value.is<i8>()) {
        segments.push(`${key}:${JSON.stringify(value.get<i8>())}`);
      } else if (value.is<u8>()) {
        segments.push(`${key}:${JSON.stringify(value.get<u8>())}`);
      } else if (value.is<i16>()) {
        segments.push(`${key}:${JSON.stringify(value.get<i16>())}`);
      } else if (value.is<u16>()) {
        segments.push(`${key}:${JSON.stringify(value.get<u16>())}`);
      } else if (value.is<string>()) {
        segments.push(`${key}:${JSON.stringify(value.get<string[]>())}`);
      } else if (value.is<bool[]>()) {
        segments.push(`${key}:${JSON.stringify(value.get<bool[]>())}`);
      } else if (value.is<i32[]>()) {
        segments.push(`${key}:${JSON.stringify(value.get<i32[]>())}`);
      } else if (value.is<u32[]>()) {
        segments.push(`${key}:${JSON.stringify(value.get<u32[]>())}`);
      } else if (value.is<i64[]>()) {
        segments.push(`${key}:${JSON.stringify(value.get<i64[]>())}`);
      } else if (value.is<f32[]>()) {
        segments.push(`${key}:${JSON.stringify(value.get<f32[]>())}`);
      } else if (value.is<f64[]>()) {
        segments.push(`${key}:${JSON.stringify(value.get<f64[]>())}`);
      } else if (value.is<i8[]>()) {
        segments.push(`${key}:${JSON.stringify(value.get<i8[]>())}`);
      } else if (value.is<u8[]>()) {
        segments.push(`${key}:${JSON.stringify(value.get<u8[]>())}`);
      } else if (value.is<i16[]>()) {
        segments.push(`${key}:${JSON.stringify(value.get<i16[]>())}`);
      } else if (value.is<u16[]>()) {
        segments.push(`${key}:${JSON.stringify(value.get<u16[]>())}`);
      } else {
        throw new Error(
          "Query parameters must be simple types, or arrays of simple types.",
        );
      }
    }

    return `{${segments.join(",")}}`;
  }
}
