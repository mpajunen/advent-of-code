"use strict"

const fs = require('fs')


const sum = (a, b) => a + b

const directions = {
    '<': [-1, 0],
    '>': [1, 0],
    '^': [0, 1],
    'v': [0, -1],
}

const move = ({x, y}, [dx, dy]) => {
    return {
        x: x + dx,
        y: y + dy,
    }
}

const buildPositions = (preceding, movement, index) => {
    const current = move(preceding[index], movement)

    preceding.push(current)

    return preceding
}

const buildCounts = (counts, {x, y}) => {
    if (counts[x] === undefined) {
        counts[x] = {}
    }
    counts[x][y] = counts[x][y] === undefined ? 1 : counts[x][y] + 1

    return counts
}

const countPositions = (counts) =>
    Object.keys(counts)
        .map(key => Object.keys(counts[key]).length)
        .reduce(sum, 0)

const origin = {x: 0, y: 0}


const movements = fs
    .readFileSync('input/day3.txt', 'utf8')
    .split('')
    .map(movement => directions[movement])


const positions1 = movements
    .reduce(buildPositions, [origin])

const counts1 = positions1
    .reduce(buildCounts, {})

const result1 = countPositions(counts1)

console.log(result1)


const santaMoves = movements
    .filter((value, key) => key % 2 === 0)

const roboMoves = movements
    .filter((value, key) => key % 2 === 1)

const positions2 = santaMoves
    .reduce(buildPositions, [origin])
    .concat(roboMoves
        .reduce(buildPositions, [origin])
    )

const counts2 = positions2
    .reduce(buildCounts, {})

const result2 = countPositions(counts2)

console.log(result2)


