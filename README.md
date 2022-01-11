# estree-halstead

[Halstead complexity measures] for ESTree.

Calculate complexity using [Halstead complexity measures] from an ESTree-compliant AST.

[![NPM license](https://img.shields.io/npm/l/estree-halstead.svg)](https://www.npmjs.com/package/estree-halstead)
[![NPM version](https://img.shields.io/npm/v/estree-halstead.svg)](https://www.npmjs.com/package/estree-halstead)
[![NPM downloads](https://img.shields.io/badge/dynamic/json.svg?label=downloads&colorB=green&suffix=/day&query=$.downloads&uri=https://api.npmjs.org//downloads/point/last-day/estree-halstead&maxAge=3600)](http://www.npmtrends.com/estree-halstead)
[![NPM downloads](https://img.shields.io/npm/dw/estree-halstead.svg)](http://www.npmtrends.com/estree-halstead)
[![NPM downloads](https://img.shields.io/npm/dm/estree-halstead.svg)](http://www.npmtrends.com/estree-halstead)
[![NPM downloads](https://img.shields.io/npm/dy/estree-halstead.svg)](http://www.npmtrends.com/estree-halstead)
[![NPM downloads](https://img.shields.io/npm/dt/estree-halstead.svg)](http://www.npmtrends.com/estree-halstead)
[![Build Status](https://github.com/ota-meshi/estree-halstead/workflows/CI/badge.svg?branch=main)](https://github.com/ota-meshi/estree-halstead/actions?query=workflow%3ACI)

## 💿 Installation

```bash
npm install estree-halstead
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
