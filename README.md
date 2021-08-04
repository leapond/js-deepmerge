# This project has been deprecated

Moved to [https://gitea.com/leapond/utilities](@leapond/utilities)

# js-deepmerge

Object, Array, Set, Map supported deepmerge.

## Power

1. Dig Object/Array/Map() Objects, merge Set() items. (WeakSet/WeakMap can not be merged)
1. Circled Reference detecting and safety
1. Target clone/reuse options supported `options.clone`:
    1. `0,false,-Infinity,default` reuse all. all `target`'s existed object will be reused.)
    1. `true, Infinity` clone all Objects/Array/Map/Set
    1. `number>0` clone depth
    1. `number<0` reuse depth(`-2` means `target` and `target.a` will be reused, and deeper items will be cloned)
1. Powerful Array merge build-in Polices: `options.arrayPolicy: deepMerge.ARRAY_CONCAT_UNIQ`
1. Custom Array merge function define: `options.arrayMerge`

Found more in the `Options` document and Enjoy your playing. 🏓

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
// bundled
import deepMerge from "leapond-deepmerge";
// source (recommend)
import deepMerge from "leapond-deepmerge/src";

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

* `arrayMerge` Function with higher priority to `arrayPolicy`

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

## Array Merge Policies

```javascript
/**
 * @property ARRAY_NORMAL - write by index
 * @property ARRAY_NORMAL_FIXED - existed items will be readonly, but can attach new items
 * @property ARRAY_CONCAT - concat to target array
 * @property ARRAY_CONCAT_UNIQ - concat to target array, but skip existed item
 * @property ARRAY_REPLACE - replace whole array
 * @property ARRAY_SEAL - fixed length
 * @property ARRAY_FREEZE - ignore source
 */
```
