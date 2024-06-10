import { JSON } from "json-as";

export class QueryVariables {
  private data: Map<string, string> = new Map<string, string>();

  public set<T>(name: string, value: T): void {
    this.data.set(name, JSON.stringify(value));
  }

  public toJSON(): string {
    const segments: string[] = [];
    const keys = this.data.keys();
    const values = this.data.values();

    for (let i = 0; i < this.data.size; i++) {
      const key = JSON.stringify(keys[i]);
      const value = values[i]; // already in JSON
      segments.push(`${key}:${value}`);
    }

    return `{${segments.join(",")}}`;
  }
}
