import chai from "chai";
import { jestSnapshotPlugin } from "mocha-chai-jest-snapshot";
import { parse } from "@typescript-eslint/parser";
import path from "path";
import { listupFixtures } from "./utils";
import { walk } from "../../src/walker";
import type { ExtractTokensResult } from "../../src/extract-tokens";
import { extractTokens } from "../../src/extract-tokens";
import type { TSESTree } from "@typescript-eslint/types";
import { AST_NODE_TYPES } from "@typescript-eslint/types";
import { assert } from "chai";

// import { fileURLToPath } from "url"
// const filename = fileURLToPath(import.meta.url)
const dirname = __dirname; // path.dirname(filename)

chai.use(jestSnapshotPlugin());
const FIXTURES_ROOT = path.resolve(dirname, "../fixtures");
// const SRC_ROOT = path.resolve(dirname, "../../src")
describe("test for extractTokens", () => {
  for (const fixture of listupFixtures(
    FIXTURES_ROOT,
    // , SRC_ROOT
  )) {
    describe(fixture.filename, () => {
      const ast = parse(fixture.content, {
        project: [],
        loc: true,
        range: true,
        comment: true,
        tokens: true,
      });
      let stripedComment = fixture.content;
      for (const comment of ast.comments || []) {
        stripedComment = `${stripedComment.slice(
          0,
          comment.range[0],
        )}${" ".repeat(
          comment.range[1] - comment.range[0],
        )}${stripedComment.slice(comment.range[1])}`;

        // ignore next char
        if (comment.value.trim() === "@__IGNORE__") {
          stripedComment = `${stripedComment.slice(
            0,
            comment.range[1],
          )}${" "}${stripedComment.slice(comment.range[1] + 1)}`;
        }
      }
      const set = new Set<string>();
      walk(ast, (node) => {
        if (node.type === "Identifier") return;
        const code = fixture.content.slice(...node.range);
        if (set.has(code)) return;
        set.add(code);
        it(`${node.type}\`\n${code}\n\``, () => {
          const tokens = extractTokens(node);
          chai
            .expect({
              operands: tokens.operands.all,
              operators: tokens.operators.all,
            })
            .toMatchSnapshot();
        });

        it(`check tokens for ${node.type}\`\n${code}\n\``, () => {
          const tokens = extractTokens(node);
          const remainTokens = splitTokens(
            stripedComment.slice(...node.range),
            tokens,
            node,
          );

          assert.deepEqual(
            // eslint-disable-next-line max-nested-callbacks -- ignore
            remainTokens.split(/\s+/).filter((s) => s),
            [],
          );
        });
      });
    });
  }
});

function splitTokens(
  code: string,
  tokensResult: ExtractTokensResult,
  node: TSESTree.Node,
): string {
  if (
    node.type === AST_NODE_TYPES.TSTypeAnnotation ||
    node.type === AST_NODE_TYPES.TemplateElement ||
    node.type === AST_NODE_TYPES.TSTypeParameter
  ) {
    return "";
  }
  const tokens = [
    ...tokensResult.operands.all,
    ...tokensResult.operators.all,
    ..."()".repeat(matchCount(/return\s*\(/gu)),
    ..."()".repeat(matchCount(/while\s*\(\s*\(/gu)),
    ..."()".repeat(matchCount(/\(\w+\)\s*=>/gu)),
    ...",".repeat(matchCount(/,\s*[)\]}]/gu)),
    ...";".repeat(matchCount(/;/gu)),
    ..."|".repeat(matchCount(/[=]\s*\|/gu)),
    ..."|".repeat(matchCount(/^\s*\|/gu)),
  ]
    .flatMap((token) =>
      token === "{}" ||
      token === "()" ||
      token === "[]" ||
      token === "?:" ||
      token === "<>"
        ? [...token]
        : token === "if()"
        ? ["if", "(", ")"]
        : token === "for()"
        ? ["for", "(", ")"]
        : token === "while()"
        ? ["while", "(", ")"]
        : token === "switch()"
        ? ["switch", "(", ")"]
        : token === "with()"
        ? ["with", "(", ")"]
        : token,
    )
    .sort((a, b) => b.length - a.length);
  let remain = code;
  for (const token of tokens) {
    let index = remain.indexOf(token);
    if (index < 0) {
      if (/^".*"$/.test(token)) {
        index = remain.indexOf(token.replace(/^"|"$/g, "'"));
      }
    }
    if (index >= 0) {
      remain = `${remain.slice(0, index)}${remain
        .slice(index, index + token.length)
        .replace(/[^\n]/gu, " ")}${remain.slice(index + token.length)}`;
    } else if (token !== ";" && token !== "function") {
      assert.fail(`Unexpected token: ${token}`);
    }
  }
  return remain;

  function matchCount(regexp: RegExp) {
    let count = 0;
    while (regexp.test(code)) count++;
    return count;
  }
}
