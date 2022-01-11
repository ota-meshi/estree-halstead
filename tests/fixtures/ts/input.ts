a = b + c + d
a = b + (c + d)

abstract class Abs {
    abstract m(this: Abs, a: number): void {}

    abstract me(this: Abs, a: string): void

    static abstract sm(this: Abs, a: boolean): void {}

    static abstract sme(this: Abs, a: null): void

    abstract x: number
    // abstract xv: number = 42

    static abstract sx: number
    // static abstract sxv: number = 42
}
const a:any=42, b: bigint = 42n
type T = any
type T2 = {}
type T3 = { [k: string ]: void };
type T4 = T3[string]
type T5 = {key:number}
type A = T[]
type R = Array<string>
interface CallSignature { <T> (e: T): R }
interface ConstructSignature { new <T> (e: T): R }
class IMPL implements T, T2 {}
type ConditionalType<T> = T extends Foo ? T : U
type ConstructorType = new ()=>void
type FunctionType = ()=>void
function fn(a: unknown): void;
function fn(a: unknown, b: never): void;
function fn(): void {}
enum Enum {
    B,
    C = "C"
}
export = foo
import a = require('foo')
type ImportType = import('foo').B
type UnpackedPromise<T=string> = T extends Promise<infer U>
  ? U
  : T
interface I extends E implements T {}
type IntersectionType = A & B
type UnionType = A | B
type Uppercase<S extends string> = intrinsic;
type MappedType = {[key in foo]: bar}
type Required<T> = {
    [P in keyof T]-?: T[P];
};
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};
type MethodSignature = {
    fn(arg: A): R | null;
}
declare global { }
declare module "foo" { }
export
as
namespace
a
;
type NamedTuple = [a: symbol, ...b: string[]]
const foo = bar!
type OptionalType = [number?]
class Class {
    constructor(private a)
}
type QualifiedName = A.B
type TemplateLiteralType = `A${B}C`
const typeAssertion = <string>"foo"
type Keyof = keyof T
type Typeof = typeof typeAssertion
type TypePredicate = (v)=>v is T
