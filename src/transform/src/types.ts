export class FunctionSignature {
  constructor(
    public name: string,
    public parameters: Parameter[],
    public returnType: string,
  ) {}

  toString() {
    const params = this.parameters
      .map((p) => `${p.name}: ${p.type}`)
      .join(", ");
    return `${this.name}(${params}): ${this.returnType}`;
  }
}

interface Parameter {
  name: string;
  type: string;
}
