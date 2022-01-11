# estree-halstead

[Halstead complexity measures] for ESTree.

Calculate complexity using [Halstead complexity measures] from an ESTree-compliant AST.

## 💿 Installation

```bash
npm install --save-dev estree-halstead
```

## 📖 Usage

```js
import { analyze } from 'estree-halstead'
import acorn from 'acorn'

const ast = acorn.parse(sourceCode, options); // https://github.com/acornjs/acorn
const result /* : Result */ = analyze(ast)
console.log(result)

// declare type Result = {
//     vocabulary: number;
//     length: number;
//     volume: number;
//     difficulty: number;
//     effort: number;
//     time: number;
//     deliveredBugs: number;
// };
```

[Halstead complexity measures]: https://en.wikipedia.org/wiki/Halstead_complexity_measures

Note:  
The calculation uses the AST, so tokens not included in the AST, such as semicolons and unwanted parenthesis tokens, are ignored.
This means that the calculation result is format independent.
