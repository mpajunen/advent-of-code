'use strict'

const fs = require('fs')
const immutable = require('immutable')
const R = require('ramda')

const input = fs.readFileSync('input/day12.txt', 'utf8')

const doc = immutable.fromJS(JSON.parse(input))

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
const result1 = doc.reduce(getSum1, 0)
console.log(result1)

const isNotMapWithRed = collection =>
  !(immutable.Map.isMap(collection) && collection.includes('red'))
const getSum2 = getSumFunction(isNotMapWithRed)
const result2 = doc.reduce(getSum2, 0)

console.log(result2)
