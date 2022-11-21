import { AST_NODE_TYPES } from "@typescript-eslint/types";
import path from "path";
import fs from "fs";

// import { fileURLToPath } from "url"
// const filename = fileURLToPath(import.meta.url)
const dirname = __dirname; // path.dirname(filename)

const codeFilename = path.join(dirname, "../src/visitor.ts");

let code = `import type { TSESTree, AST_NODE_TYPES } from "@typescript-eslint/types";
export type Visitor = {`;
for (const nodeType of Object.keys(AST_NODE_TYPES)) {
  let argType = `TSESTree.${nodeType}`;
  if (nodeType === "TSIntrinsicKeyword") {
    argType = `TSESTree.Node & { type: AST_NODE_TYPES.${nodeType}}`;
  }
  code += `${nodeType}?: (node: ${argType}, parent: TSESTree.Node | null) => void,`;
}
code += "}";
fs.writeFileSync(codeFilename, code);
