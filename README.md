# js-deepmerge

Object, Array, Set, Map supported deepmerge.

## Installation

**NPM**

```shell
npm i leapond-deepmerge
```

**Yarn**

```shell
yarn add leapond-deepmerge
```

## Usage

```javascript
import deepMerge from "leapond-deepmerge";

console.log(deepMerge(
    {a: 1, b: {x: 1}, c: [0, 1], d: new Set, e: new Map([[1, {x: 1}]])},
    {a: 2, b: {x: 1, y: 2}, c: [1, 2, 3], d: new Set([2]), e: new Map([[1, {z: 200}], [2, 2]])},
    {clone: -1, arrayPolicy: deepMerge.ARRAY_CONCAT_UNIQ}
))
/* output: 
    {
      a: 2,
      b: { x: 1, y: 2 },
      c: [ 0, 1, 2, 3 ],
      d: Set(1) { 2 },
      e: Map(2) { 1 => { x: 1, z: 200 }, 2 => 2 }
    }
 */

console.log(deepMerge.batch([
  null,
  [11, 22],
  {a: 1, b: {x: 1}, c: [0, 1], d: new Set, e: new Map([[1, {x: 1}]])},
  {a: 2, b: {x: 1, y: 2}, c: [1, 2, 3], d: new Set([2]), e: new Map([[1, {z: 200}], [2, 2]])}
], {clone: 2}))
/* output:
    {
      a: 2,
      b: { x: 1, y: 2 },
      c: [ 1, 2, 3 ],
      d: Set(1) { 2 },
      e: Map(2) { 1 => { x: 1, z: 200 }, 2 => 2 }
    }
 */
```

## Options

```javascript
/**
 * @typedef mergeOptions
 * @property {boolean|number} [clone=-Infinity] - if clone target. <br/>> true for all, false for none, <br/>> number<0 for reuse depth, number>0 for clone depth
 * @property {boolean} [unEnumerableInclude=false] - if include keys not enumerable(and Symbol keys)
 * @property {arrayMergePolicies} [arrayPolicy=ARRAY_NORMAL] - array merge policy of build-in
 * @property {function} [arrayMerge] - custom array merger, (a, b) => result
 * @property {boolean} [deepMap=true] - if dig in Map items
 */
```