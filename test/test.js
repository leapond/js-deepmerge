import deepMerge from "../src";

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

test('Merge Options(2)', () => {
  let d = 4, c = {d}, b = {c}, a = {b}
  let aa = {a},
      bb = {a: {b: {c: {d: 4, dd: 44}}}},
      cc = deepMerge(aa, bb, {clone: 2});
  expect(cc !== aa).toBe(true)
  expect(cc.a !== a).toBe(true)
  expect(cc.a.b === b).toBe(true)
  expect(cc.a.b.c === c).toBe(true)
  expect(cc.a.b.c.d === 4).toBe(true)
  expect(cc.a.b.c.dd === 44).toBe(true)
})

test('Merge Options(-2)', () => {
  let d = 4, c = {d}, b = {c}, a = {b}
  let aa = {a},
      bb = {a: {b: {c: {d: 4, dd: 44}}}},
      cc = deepMerge(aa, bb, {clone: -2});
  expect(cc === aa).toBe(true)
  expect(cc.a === a).toBe(true)
  expect(cc.a.b !== b).toBe(true)
  expect(cc.a.b.c !== c).toBe(true)
  expect(cc.a.b.c.d === 4).toBe(true)
  expect(cc.a.b.c.dd === 44).toBe(true)
})