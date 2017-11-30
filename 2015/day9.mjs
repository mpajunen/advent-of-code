"use strict"

import fs from 'fs'

import * as utils from './utils'

const input = fs.readFileSync('input/day9.txt', 'utf8')

const readRoute = str => {
    const [from, , to, , distance] = str.split(' ')

    return {
        from,
        to,
        amount: parseInt(distance, 10)
    }
}

const routes = input
    .split('\n')
    .map(readRoute)


const places = utils.getNodes(routes)

const distances = utils.getAmounts(places, routes)

const getKeys = list => list.map((_, key) => key)

const perms = utils.getPermutations(getKeys(places))

const limits = utils.getPermutationMinMax(perms, distances)

console.log(limits)
