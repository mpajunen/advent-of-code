"use strict"

const fs = require('fs')
//const immutable = require('immutable')
const R = require('ramda')


const input = fs.readFileSync('input/day9.txt', 'utf8')

const readRoute = str => {
    const [from, , to, , distance] = str.split(' ')

    return {
        from,
        to,
        distance: parseInt(distance, 10)
    }
}

const routes = input
    .split('\n')
    .map(readRoute)

const getPlaces = R.pipe(
    R.map(R.props(['from', 'to'])),
    R.flatten,
    R.uniq
)

const places = getPlaces(routes)

//console.log(routes)
//console.log(places)

const emptyDistances = places.map(() => [])

const distances = routes.reduce((distances, {from, to, distance}) => {
    const fromKey = places.indexOf(from)
    const toKey = places.indexOf(to)

    distances[fromKey][toKey] = distance
    distances[toKey][fromKey] = distance

    return distances
}, emptyDistances)

const getKeys = list => list.map((_, key) => key)

const getOtherValues = (list, index) =>
    list.slice(0, index).concat(list.slice(index + 1))

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

const perms = getKeys(places)
//const combinations = [1, 2, 3, 4, 5]
    .reduce(permute, [])


const getDistance = perm => perm
    .map((from, index, perm) => distances[from][perm[index + 1]])
    .slice(0, -1)
    .reduce(sum)

const permDistances = perms.map(getDistance)

const smallest = permDistances.reduce(R.min)
const largest = permDistances.reduce(R.max)

//console.log(distances)
//console.log(perms)
//console.log(perms.length)
//console.log(permDistances)
console.log(smallest)
console.log(largest)
