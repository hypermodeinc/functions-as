import { getTypeName } from "./extractor.js";

export class ProgramInfo {
  exportFns: FunctionSignature[];
  importFns: FunctionSignature[];
  types: TypeDefinition[];
}

export class Result {
  public name?: string;
  public type: string;
}

export class FunctionSignature {
  constructor(
    public name?: string,
    public parameters?: Parameter[],
    public results?: Result[],
  ) {}

  toString() {
    let params = "";
    for (let i = 0; i < this.parameters.length; i++) {
      const param = this.parameters[i]!;
      const defaultValue = param.default;
      params += `${param.name}: ${getTypeName(param.type)}`;
      if (defaultValue !== undefined) {
        params += ` = ${JSON.stringify(defaultValue)}`;
      }
      params += ", ";
    }
    return `${this.name}(${params.endsWith(", ") ? params.slice(0, params.length - 2) : params}): ${getTypeName(this.results[0].type)}`;
  }
}

export class TypeDefinition {
  constructor(
    public name: string,
    public id: number,
    public fields?: Field[],
  ) {}

  toString() {
    const name = getTypeName(this.name);
    if (!this.fields || this.fields.length === 0) {
      return name;
    }

    const fields = this.fields
      .map((f) => `${f.name}: ${getTypeName(f.type)}`)
      .join(", ");
    return `${name} { ${fields} }`;
  }

  isHidden() {
    if (typeMap.has(this.name)) return true;
    if (this.name.startsWith("~lib/array/Array<")) return true;
    if (this.name.startsWith("~lib/map/Map<")) return true;

    return false;
  }
}

export type JsonLiteral =
  | null
  | boolean
  | number
  | string
  | Array<JsonLiteral>
  | { [key: string]: JsonLiteral };

export interface Parameter {
  name: string;
  type: string;
  default?: JsonLiteral;
}

interface Field {
  name: string;
  type: string;
}

export const typeMap = new Map<string, string>([
  ["~lib/string/String", "string"],
  ["~lib/array/Array", "Array"],
  ["~lib/map/Map", "Map"],
  ["~lib/date/Date", "Date"],
  ["~lib/wasi_date/wasi_Date", "Date"],
]);
