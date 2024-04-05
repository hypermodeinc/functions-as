export class FunctionSignature {
  constructor(
    public name: string,
    public parameters: NameTypePair[],
    public returnType: string,
  ) {}

  toString() {
    const params = this.parameters
      .map((p) => `${p.name}: ${p.type}`)
      .join(", ");
    return `${this.name}(${params}): ${this.returnType}`;
  }
}

export class TypeDefinition {
  constructor(
    public name: string,
    public fields?: NameTypePair[],
  ) {}

  toString() {
    // If there are no fields, just return the name. It will be interpreted as a scalar type.
    if (!this.fields || this.fields.length === 0) {
      return this.name;
    }

    const fields = this.fields.map((f) => `${f.name}: ${f.type}`).join(", ");
    return `${this.name} { ${fields} }`;
  }
}

interface NameTypePair {
  name: string;
  type: string;
}
