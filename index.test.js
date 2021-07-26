import deepMerge from "libs/deep-merge.esm";

let a1 = 1, a2 = undefined,
    b1 = {
      a: 1,
      b: 2,
      d: {x: 1},
      e: [1, 2],
      f: new Set([1, 2]),
      g: new Map([[1, {x: 1, y: 2}]])
    },
    b2 = {
      b: 20,
      c: 30,
      d: {x: 10},
      e: [30],
      f: new Set([2, 3]),
      g: new Map([[1, {y: 20, z: 30, zz: 33}], [2, 55]]),
      z: {zz: 100, z1: {z2: {z3: 9}}}
    }

test('Simple Merge', () => {
  let a3 = deepMerge(a1, a2)
  expect(a3).toBe(a2)
  a1 = null
  a3 = deepMerge(a1, a2)
  expect(a3).toBe(a2)
  a1 = String('a')
  a3 = deepMerge(a1, a2)
  expect(a3).toBe(a2)
})

test('Normal Merge', () => {
  let b3 = deepMerge(b1, b2)
  expect(b3 === b1).toBe(true)
  expect(b3.a === 1 && b3.b === 20 && b3.c === 30).toBe(true)
  expect(b3.e[0] === 30 && b3.e[1] === 2).toBe(true)
  expect(b3.f === b1.f).toBe(true)
  expect([...b3.f.values()].join()).toBe('1,2,3')
  expect(b3.g.get(1).x === 1 && b3.g.get(1).y === 20).toBe(true)
  expect(b3.zz === b2.zz).toBe(true)
})

test('Merge Options', () => {
  let b3 = deepMerge(b1, b2, {clone: -1})
  //expect(b3 === b1).toBe(true)
  expect(b3.a === 1 && b3.b === 20 && b3.c === 30).toBe(true)
  expect(b3.e[0] === 30 && b3.e[1] === 2).toBe(true)
  expect(b3.f === b1.f).toBe(true)
  expect([...b3.f.values()].join()).toBe('1,2,3')
  expect(b3.g.get(1).x === 1 && b3.g.get(1).y === 20).toBe(true)
  expect(b3.zz === b2.zz).toBe(true)
})