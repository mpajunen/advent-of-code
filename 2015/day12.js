'use strict'

const immutable = require('immutable')

const getSumFunction = filter => {
  const getCollectionSum = collection =>
    filter(collection) ? collection.reduce(getSum, 0) : 0

  const getNodeSum = node =>
    typeof node === 'number'
      ? node
      : typeof node === 'string'
        ? 0
        : getCollectionSum(node)

  const getSum = (sum, node) => sum + getNodeSum(node)

  return getSum
}

const getSum1 = getSumFunction(() => true)

const isNotMapWithRed = collection =>
  !(immutable.Map.isMap(collection) && collection.includes('red'))
const getSum2 = getSumFunction(isNotMapWithRed)

export default ([row]) => {
  const doc = immutable.fromJS(JSON.parse(row))

  const result1 = doc.reduce(getSum1, 0)
  const result2 = doc.reduce(getSum2, 0)

  return [result1, result2, 119433, 68466]
}
