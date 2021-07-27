import deepCopy from "leapond-deepcopy/src";
import {getMergeType} from "leapond-js-utils/src";


const INNER_MARK = Symbol(''/*<DEV*/ + 'INNER'/*DEV>*/)
/**
 * @property ARRAY_NORMAL - write by deepMerge
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
  [INNER_MARK]: 1,
  clone: -Infinity,
  unEnumerableInclude: false,
  arrayPolicy: arrayMergePolicies.ARRAY_NORMAL,
  // (a, b) => a.push(b) && a
  arrayMerge: undefined,
  deepMap: true
}

/**
 * @typedef mergeOptions
 * @property {boolean|number} [clone=-Infinity] - if clone target. <br/>> true for all, false for none, <br/>> number<0 for reuse depth, number>0 for clone depth
 * @property {boolean} [unEnumerableInclude=false] - if include keys not enumerable(and Symbol keys)
 * @property {arrayMergePolicies} [arrayPolicy=ARRAY_NORMAL] - array merge policy of build-in
 * @property {function} [arrayMerge] - custom array merger, (a, b) => result
 * @property {boolean} [deepMap=true] - if dig in Map items
 */

/**
 * @param target
 * @param source
 * @param {mergeOptions} [options]
 * @return {*|{}|[]|[]}
 */
function deepMerge(target, source, options) {
  let isRoot = true, aLoops, depthCurrent = 0, typeTarget = getMergeType(target), typeSource = getMergeType(source)
  // clone source while target type is not same with source
  if (!typeTarget || typeTarget !== typeSource) return source
  // detect root and merge options
  if (options && options[INNER_MARK]) isRoot = false; else options = parseOptions(options)
  // init loop circle and depth recorder
  if (isRoot || arguments[4]) { // arguments[4] is passed by batch()
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
        case arrayMergePolicies.ARRAY_FREEZE:
          return target
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
      source.forEach(v => target.add(v))
      break
    case 4:
      source.forEach((v, k) => target.set(k, options.deepMap ? deepMerge(target.get(k), v, options, aLoops) : v))
      break
  }
  return target
}

/**
 *
 * @param {Object[]} aTargets
 * @param {mergeOptions} [options]
 * @return {*}
 */
deepMerge.batch = function (aTargets, options) {
  options = parseOptions(options)
  return aTargets.reduce((a, b) => deepMerge(a, b, options, null, true))
}

function parseOptions(options) {
  options = Object.assign({}, optionsDefault, options)
  if (options.clone === true) options.clone = Infinity; else if (!(options.clone >= -Infinity)) options.clone = optionsDefault.clone
  return options
}

Object.assign(deepMerge, arrayMergePolicies)

export default deepMerge