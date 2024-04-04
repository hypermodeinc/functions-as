import { FunctionSignature } from "./types.js";
import { BaseVisitor, utils } from "visitor-as";
import {
  FunctionDeclaration,
  TypeNode,
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
      type: getTypeName(p.type),
    }));

    const returnType = getTypeName(signature.returnType);

    const f = new FunctionSignature(name, parameters, returnType);
    this.functions.set(path, f);
  }
}

const arrayRegex = /^Array<(.+)>/;
function getTypeName(t: TypeNode): string {
  // this does most of the work
  let s = utils.toString(t);

  // replace Array<T> with T[]
  for (;;) {
    const match = s.match(arrayRegex);
    if (match === null) {
      break;
    }

    let t = match[1];
    if (t.endsWith(" | null")) {
      t = `(${t})`;
    }

    s = t + "[]" + s.slice(match[0].length);
  }

  return s;
}
