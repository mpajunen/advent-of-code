"use strict"

const fs = require('fs')
const immutable = require('immutable')


const input = fs.readFileSync('input/day7.txt', 'utf8')

const isInt = x => /^\d+$/.test(x)
const convertInt = x => isInt(x) ? parseInt(x, 10) : x
const splitConnection = connection => connection
    .split(' ')
    .reverse()
const convertConnection = ([target, _, right, gate = null, left]) => {
    return {
        left: convertInt(left),
        right: convertInt(right),
        gate,
        target,
    }
}

const connections = input
    .split('\n')
    .map(splitConnection)
    .map(convertConnection)


const findSingleWireConnection = wire =>
    connections.find(({target}) => target === wire)
const findConnections = ({left, right}) => {
    return findWireConnections(left).concat(...findWireConnections(right))
}
const findWireConnections = wire => {
    const direct = findSingleWireConnection(wire)
    if (direct === undefined) {
        return []
    }
//console.log(wire)
//console.log(direct)
    const nested = findConnections(direct)

    return nested.concat(direct)
}

//const sortedConnections = findWireConnections('a')

const toMap = (array, keyProp) => {
    let map = {}

    array.forEach(item => map[item[keyProp]] = item)

    return map
}

const connectionMap = toMap(connections, 'target')

const isConnectionUntaken = current => connection => current[connection.target] === undefined
const isValueFree = current => value => typeof value !== 'string' || current[value] !== undefined
const isConnectionFree = current => {
    const checkValue = isValueFree(current)

    return ({left, right}) => checkValue(left) && checkValue(right)
}

const findNewFreeConnections = (current) =>
    connections
        .filter(isConnectionUntaken(current))
        .filter(isConnectionFree(current))


//const sortedConnections = connectionMap


let sortedConnections = {}

while (sortedConnections['a'] === undefined) {
    findNewFreeConnections(sortedConnections)
        .forEach(connection => sortedConnections[connection.target] = connection)
}


const foo = findNewFreeConnections({})

//console.log(foo)


const gates = {
    AND: (left, right) => left & right,
    OR: (left, right) => left | right,
    NOT: (left, right) => ~right,
    LSHIFT: (left, right) => left << right,
    RSHIFT: (left, right) => left >> right,
    null: (left, right) => right
}

const handleConnection = (wires, {left, right, gate, target}) => {
    const leftIn = typeof left === 'number' ? left : wires[left]
    const rightIn = typeof right === 'number' ? right : wires[right]

    wires[target] = gates[gate](leftIn, rightIn)

    //console.log(`${gate}(${left}: ${leftIn}, ${right}: ${rightIn}) => ${target}: ${wires[target]}`)

    return wires
}

const sortedMap = immutable.OrderedMap(sortedConnections)
const result1 = sortedMap
    .reduce(handleConnection, {})


console.log(sortedConnections)
//console.log(result1)

const replacement = {left: undefined, right: result1.a, gate: null, target: 'b'}

const fixedMap = sortedMap.set('b', replacement)

const result2 = fixedMap
    .reduce(handleConnection, {})

//console.log(fixedMap.toJS())
console.log(result2)
