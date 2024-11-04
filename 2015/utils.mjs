'use strict'

import { List } from '../common'

const getOtherValues = (list, index) =>
  list.slice(0, index).concat(list.slice(index + 1))

const getPermutationAmount = amounts => perm =>
  perm
    .map((from, index, perm) => amounts[from][perm[index + 1]])
    .slice(0, -1)
    .reduce(sum)

export const getPermutations = list => list.reduce(permute, [])

const permute = (res, value, index, list) => {
  if (list.length === 1) {
    return [value]
  }

  const perms = getOtherValues(list, index)
    .reduce(permute, [])
    .map(perm => {
      return [value].concat(perm)
    })

  return res.concat(perms)
}

const sum = (sum, value) => sum + value

export const getNodes = routes =>
  List.unique(routes.flatMap(({ from, to }) => [from, to]))

export const getAmounts = (places, routes) => {
  const emptyAmounts = places.map(() => [])

  return routes.reduce((amounts, { from, to, amount }) => {
    const fromKey = places.indexOf(from)
    const toKey = places.indexOf(to)

    amounts[fromKey][toKey] = amount
    amounts[toKey][fromKey] = amount

    return amounts
  }, emptyAmounts)
}

export const getCircularPermutations = list =>
  getPermutations(list).map(perm => perm.concat([perm[0]]))

export const getPermutationMinMax = (perms, amounts) => {
  const permAmounts = perms.map(getPermutationAmount(amounts))

  return {
    min: permAmounts.reduce((a, b) => Math.min(a, b), Number.MAX_SAFE_INTEGER),
    max: permAmounts.reduce((a, b) => Math.max(a, b), 0),
  }
}
