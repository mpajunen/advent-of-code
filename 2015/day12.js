'use strict'

const getSumFunction = filter => {
  const getCollectionSum = collection =>
    filter(collection) ? Object.values(collection).reduce(getSum, 0) : 0

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
  Array.isArray(collection) || !Object.values(collection).includes('red')
const getSum2 = getSumFunction(isNotMapWithRed)

export default ([row]) => {
  const doc = JSON.parse(row)

  const result1 = getSum1(0, doc)
  const result2 = getSum2(0, doc)

  return [result1, result2, 119433, 68466]
}
