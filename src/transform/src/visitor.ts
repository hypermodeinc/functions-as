import { FunctionSignature } from "./types.js";
import { BaseVisitor } from "visitor-as";
import {
  FunctionDeclaration,
  NamedTypeNode,
} from "assemblyscript/dist/assemblyscript.js";

export class HypermodeVisitor extends BaseVisitor {
  functions = new Map<string, FunctionSignature>();

  visitFunctionDeclaration(node: FunctionDeclaration): void {
    const internalPath = node.range.source.internalPath;

    // skip library functions
    if (internalPath.startsWith("~")) {
      return;
    }

    const name = node.name.text;
    const path = `${internalPath}/${name}`;

    const signature = node.signature;
    const parameters = signature.parameters.map((p) => ({
      name: p.name.text,
      type: (p.type as NamedTypeNode).name.identifier.text,
    }));

    const returnTypeNode = signature.returnType as NamedTypeNode;
    const returnType = returnTypeNode.name.identifier.text;

    const f = new FunctionSignature(name, parameters, returnType);
    this.functions.set(path, f);
  }
}
