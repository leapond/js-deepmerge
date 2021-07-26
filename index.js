import deepCopy from "leapond-deepcopy";
import {getMergeType} from "leapond-js-utils";

/**
 * @property ARRAY_NORMAL - write by index
 * @property ARRAY_NORMAL_FIXED - existed item will be readonly, but can increase new item
 * @property ARRAY_CONCAT - concat to target array
 * @property ARRAY_CONCAT_UNIQ - concat to target array, but skip existed item
 * @property ARRAY_REPLACE - replace whole array
 * @property ARRAY_SEAL - fixed length
 * @property ARRAY_FREEZE - ignore source
 */
const arrayMergePolicies = {
  ARRAY_NORMAL: 1,
  ARRAY_NORMAL_FIXED: 1.1,
  ARRAY_CONCAT: 2,
  ARRAY_CONCAT_UNIQ: 2.1,
  ARRAY_REPLACE: 3,
  ARRAY_SEAL: 4,
  ARRAY_FREEZE: 5
}
const optionsDefault = {
  __v__: 1,
  clone: -Infinity,
  unEnumerableInclude: false,
  arrayPolicy: arrayMergePolicies.ARRAY_NORMAL,
  // (a, b) => a.push(b) && a
  arrayMerge: undefined,
  deepMap: true
}
/**
 * @param target
 * @param source
 * @param options
 * @param {boolean|number = -Infinity} options.clone - if clone target. <br/>> true for all, false for none, <br/>> number<0 for reuse depth, number>0 for clone depth
 * @param {boolean} options.unEnumerableInclude - if include keys not enumerable
 * @param {arrayMergePolicies} [options.arrayPolicy=ARRAY_NORMAL] - array merge policy of build-in
 * @param {function} [options.arrayMerge] - custom array merger, (a, b) => result
 * @param {boolean} [options.deepMap=true] - if dig in Map items
 * @return {*|{}|[]|[]}
 */
export default function deepMerge(target, source, options) {
  let isRoot = true, aLoops, depthCurrent = 0, typeTarget = getMergeType(target), typeSource = getMergeType(source)
  // clone source while target type is not same with source
  if (!typeTarget || typeTarget !== typeSource) return source
  // detect root and merge options
  if (options && options.__v__) isRoot = false; else {
    options = Object.assign({}, optionsDefault, options)
    // confirm depth option is right assigned
    if (options.clone === true) options.clone = Infinity; else if (!(options.clone >= -Infinity)) options.clone = optionsDefault.clone
  }
  // init loop circle and depth recorder
  if (isRoot) {
    // create new loops
    aLoops = [source]
    depthCurrent = aLoops.depthCurrent = 1
  } else {
    // concat loops
    const aLoopsPrev = arguments[3]
    aLoops = [...aLoopsPrev, source]
    // detect circled loops
    if (aLoopsPrev.includes(source)) return source
    // increase current depth
    depthCurrent = aLoopsPrev.depthCurrent + 1
  }
  // clone source while target is empty
  if (!target) return source

  // store current depth on loops array property
  aLoops.depthCurrent = depthCurrent

  // clone target current level
  //if (options.clone && (options.clone > 0 ? depthCurrent <= options.clone : depthCurrent >= -options.clone)) target = deepCopy(target, 1)
  if ((options.clone > 0 && depthCurrent <= options.clone) || (options.clone < 0 && depthCurrent > -options.clone)) target = deepCopy(target, 1)

  switch (typeSource) {
    case 1: // Object
      let keys
      if (options.unEnumerableInclude) keys = [...Object.getOwnPropertyNames(source), ...Object.getOwnPropertySymbols(source)]; else keys = Object.keys(source)
      keys.forEach(key => {
        target[key] = deepMerge(target[key], source[key], options, aLoops)
      })
      break
    case 2: // Array
      if (options.arrayMerge) return options.arrayMerge(target, source)

      switch (options.arrayPolicy) {
        case arrayMergePolicies.ARRAY_SEAL:
        case arrayMergePolicies.ARRAY_NORMAL:
        case arrayMergePolicies.ARRAY_NORMAL_FIXED:
          Object.keys(source).forEach(key => {
            if (key in target) {
              if (options.arrayPolicy === arrayMergePolicies.ARRAY_NORMAL_FIXED) return
            } else if (options.arrayPolicy === arrayMergePolicies.ARRAY_SEAL) return

            target[key] = deepMerge(target[key], source[key], options, aLoops)
          })
          break;
        case arrayMergePolicies.ARRAY_REPLACE:
          return source
        case arrayMergePolicies.ARRAY_CONCAT:
          source.forEach((v, i) => {
            target.push(deepMerge(target[i], v, options, aLoops))
          })
          break
        case arrayMergePolicies.ARRAY_CONCAT_UNIQ:
          source.forEach((v, i) => {
            !target.includes(v) && target.push(deepMerge(target[i], v, options, aLoops))
          })
      }
      break
    case 3:
      [...source.values()].forEach(v => {
        target.add(v)
      });
      break
    case 4:
      [...source.entries()].forEach(v => {
        target.set(v[0], options.deepMap ? deepMerge(target.get(v[0]), v[1], options, aLoops) : v[1])
      })
      break
  }
  return target
}
Object.assign(deepMerge, arrayMergePolicies)