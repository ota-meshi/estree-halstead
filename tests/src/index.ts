import chai from "chai";
import { jestSnapshotPlugin } from "mocha-chai-jest-snapshot";
import { parse } from "@typescript-eslint/parser";
import path from "path";
import type { TSESTree } from "@typescript-eslint/types";
import { listupFixtures } from "./utils";
import { walk } from "../../src/walker";
import { analyze } from "../../src/index";

// import { fileURLToPath } from "url"
// const filename = fileURLToPath(import.meta.url)
const dirname = __dirname; // path.dirname(filename)

chai.use(jestSnapshotPlugin());
const FIXTURES_ROOT = path.resolve(dirname, "../fixtures");
// const SRC_ROOT = path.resolve(dirname, "../../src")
describe("test for halstead complexity measures", () => {
  for (const fixture of listupFixtures(
    FIXTURES_ROOT,
    // , SRC_ROOT
  )) {
    describe(fixture.filename, () => {
      const ast = parse(fixture.content, {
        project: [],
        loc: true,
        range: true,
      }) as TSESTree.Program;
      const set = new Set<string>();
      walk(ast, (node) => {
        if (node.type === "Identifier") return;
        const code = fixture.content.slice(...node.range);
        if (set.has(code)) return;
        set.add(code);
        it(`${node.type}\`\n${code}\n\``, () => {
          chai.expect(analyze(node)).toMatchSnapshot();
        });
      });
    });
  }
});
