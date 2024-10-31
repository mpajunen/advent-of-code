'use strict'

const immutable = require('immutable')

const isInt = x => /^\d+$/.test(x)
const convertInt = x => (isInt(x) ? parseInt(x, 10) : x)
const splitConnection = connection => connection.split(' ').reverse()
const convertConnection = ([target, _, right, gate = null, left]) => {
  return {
    left: convertInt(left),
    right: convertInt(right),
    gate,
    target,
  }
}

const isConnectionUntaken = current => connection =>
  current[connection.target] === undefined
const isValueFree = current => value =>
  typeof value !== 'string' || current[value] !== undefined
const isConnectionFree = current => {
  const checkValue = isValueFree(current)

  return ({ left, right }) => checkValue(left) && checkValue(right)
}

const gates = {
  AND: (left, right) => left & right,
  OR: (left, right) => left | right,
  NOT: (left, right) => ~right,
  LSHIFT: (left, right) => left << right,
  RSHIFT: (left, right) => left >> right,
  null: (left, right) => right,
}

const handleConnection = (wires, { left, right, gate, target }) => {
  const leftIn = typeof left === 'number' ? left : wires[left]
  const rightIn = typeof right === 'number' ? right : wires[right]

  wires[target] = gates[gate](leftIn, rightIn)

  return wires
}

export default rows => {
  const connections = rows.map(splitConnection).map(convertConnection)

  const findSingleWireConnection = wire =>
    connections.find(({ target }) => target === wire)
  const findConnections = ({ left, right }) => {
    return findWireConnections(left).concat(...findWireConnections(right))
  }
  const findWireConnections = wire => {
    const direct = findSingleWireConnection(wire)
    if (direct === undefined) {
      return []
    }

    const nested = findConnections(direct)

    return nested.concat(direct)
  }

  const findNewFreeConnections = current =>
    connections
      .filter(isConnectionUntaken(current))
      .filter(isConnectionFree(current))

  let sortedConnections = {}

  while (sortedConnections['a'] === undefined) {
    findNewFreeConnections(sortedConnections).forEach(
      connection => (sortedConnections[connection.target] = connection),
    )
  }

  const sortedMap = immutable.OrderedMap(sortedConnections)
  const result1 = sortedMap.reduce(handleConnection, {}).a

  const replacement = {
    left: undefined,
    right: result1,
    gate: null,
    target: 'b',
  }

  const fixedMap = sortedMap.set('b', replacement)

  const result2 = fixedMap.reduce(handleConnection, {}).a

  return [result1, result2, 46065, 14134]
}
