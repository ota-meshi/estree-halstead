import type * as ESTree from "estree"
import type { TSESTree } from "@typescript-eslint/types"
import { extractTokens } from "./extract-tokens"
export { ExtractTokensResult, TokensCollection } from "./extract-tokens"

export type Result = {
    vocabulary: number
    length: number
    volume: number
    difficulty: number
    effort: number
    time: number
    deliveredBugs: number
}
/**
 * Analyze the AST using Halstead complexity measures.
 */
export function analyze(node: ESTree.Node | TSESTree.Node): Result {
    const context = extractTokens(node)

    const vocabulary =
        context.operators.distinctSize + context.operands.distinctSize
    const length = context.operators.totalSize + context.operands.totalSize
    const volume = length * (Math.log(vocabulary) / Math.log(2))
    const difficulty =
        (context.operators.distinctSize / 2) *
        (context.operands.distinctSize === 0
            ? 1
            : context.operands.totalSize / context.operands.distinctSize)
    const effort = difficulty * volume
    const time = effort / 18
    const deliveredBugs = volume / 3000

    return {
        vocabulary,
        length,
        volume,
        difficulty,
        effort,
        time,
        deliveredBugs,
    }
}
export { extractTokens }
