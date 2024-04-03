import { FunctionSignature } from "./types.js";
import { BaseVisitor } from "visitor-as";
export class HypermodeVisitor extends BaseVisitor {
    functions = new Map();
    visitFunctionDeclaration(node) {
        const internalPath = node.range.source.internalPath;
        if (internalPath.startsWith("~")) {
            return;
        }
        const name = node.name.text;
        const path = `${internalPath}/${name}`;
        const signature = node.signature;
        const parameters = signature.parameters.map((p) => ({
            name: p.name.text,
            type: p.type.name.identifier.text,
        }));
        const returnTypeNode = signature.returnType;
        const returnType = returnTypeNode.name.identifier.text;
        const f = new FunctionSignature(name, parameters, returnType);
        this.functions.set(path, f);
    }
}
//# sourceMappingURL=visitor.js.map