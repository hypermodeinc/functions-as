const parser = require("@typescript-eslint/parser");
module.exports = { ...parser };

const utils = require("./node_modules/@typescript-eslint/typescript-estree/dist/node-utils.js");
const ts = require("typescript");

// In AssemblyScript, functions can be decorated
nodeCanBeDecorated = utils.nodeCanBeDecorated;
utils.nodeCanBeDecorated = function (node) {
  if (node.kind == ts.SyntaxKind.FunctionDeclaration) {
    return true;
  }

  return nodeCanBeDecorated(node);
};
