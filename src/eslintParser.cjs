const parser = require("@typescript-eslint/parser");
module.exports = { ...parser };

const utils = require("./node_modules/@typescript-eslint/typescript-estree/dist/node-utils.js");
const ts = require("typescript");

// In AssemblyScript, functions and variables can be decorated
nodeCanBeDecorated = utils.nodeCanBeDecorated;
utils.nodeCanBeDecorated = function (node) {
  switch (node.kind) {
    case ts.SyntaxKind.FunctionDeclaration:
    case ts.SyntaxKind.VariableStatement:
      return true;
    default:
      return nodeCanBeDecorated(node);
  }
};
