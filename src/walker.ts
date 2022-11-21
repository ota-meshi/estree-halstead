import type { TSESTree } from "@typescript-eslint/types";
import {
  visitorKeys as baseVisitorKeys,
  getKeys,
} from "@typescript-eslint/visitor-keys";

const visitorKeys = { ...baseVisitorKeys };
visitorKeys.TSInterfaceDeclaration = [
  ...new Set([...(visitorKeys.TSInterfaceDeclaration || []), "implements"]),
];

/**
 * Traverse node
 */
export function walk(
  node: TSESTree.Node,
  visit: (node: TSESTree.Node, parent: TSESTree.Node | null) => void
): void {
  const nodes: { node: TSESTree.Node; parent: TSESTree.Node | null }[] = [
    { node, parent: null },
  ];

  let e;
  while ((e = nodes.pop())) {
    const node = e.node;
    visit(node, node.parent || e.parent);
    const keys = visitorKeys[node.type] || getKeys(node);

    for (let index = keys.length - 1; index >= 0; index--) {
      const key = keys[index];
      const value = (node as any)[key];

      if (isNode(value)) {
        nodes.push({ node: value, parent: node });
      } else if (Array.isArray(value)) {
        for (let i = value.length - 1; i >= 0; i--) {
          const v = value[i];
          if (isNode(v)) {
            nodes.push({ node: v, parent: node });
          }
        }
      }
    }
  }
}

/**
 * Check whether the given value is an ASTNode or not.
 */
function isNode(x: unknown): x is TSESTree.Node {
  return (
    x !== null && typeof x === "object" && typeof (x as any).type === "string"
  );
}
