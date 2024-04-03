export class FunctionSignature {
    name;
    parameters;
    returnType;
    constructor(name, parameters, returnType) {
        this.name = name;
        this.parameters = parameters;
        this.returnType = returnType;
    }
    toString() {
        const params = this.parameters
            .map((p) => `${p.name}: ${p.type}`)
            .join(", ");
        return `${this.name}(${params}): ${this.returnType}`;
    }
}
//# sourceMappingURL=types.js.map