"use strict"

const R = require('ramda')


const getOtherValues = (list, index) =>
    list.slice(0, index).concat(list.slice(index + 1))

const getPermutationAmount = amounts => perm => perm
    .map((from, index, perm) => amounts[from][perm[index + 1]])
    .slice(0, -1)
    .reduce(sum)

const getPermutations = list => list
    .reduce(permute, [])

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


exports.getNodes = R.pipe(
    R.map(R.props(['from', 'to'])),
    R.flatten,
    R.uniq
)

exports.getAmounts = (places, routes) => {
    const emptyAmounts = places.map(() => [])

    return routes.reduce((amounts, {from, to, amount}) => {
        const fromKey = places.indexOf(from)
        const toKey = places.indexOf(to)

        amounts[fromKey][toKey] = amount
        amounts[toKey][fromKey] = amount

        return amounts
    }, emptyAmounts)
}

exports.getPermutations = getPermutations

exports.getCircularPermutations = list => getPermutations(list)
    .map(perm => perm.concat([perm[0]]))

exports.getPermutationMinMax = (perms, amounts) => {
    const permAmounts = perms.map(getPermutationAmount(amounts))

    return {
        min: permAmounts.reduce(R.min),
        max: permAmounts.reduce(R.max),
    }
}
