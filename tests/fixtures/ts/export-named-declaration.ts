export {a} from "foo" assert { type: "json" }
export type {b as c} from "foo"

export type {d}
export type {d, e}
export {type d, e, g}

export type f = number
