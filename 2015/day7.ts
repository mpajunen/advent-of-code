'use strict'

type Connection = {
  left: number | string | undefined
  right: number | string
  gate: string | null
  target: string
}

type Connections = Record<string, Connection>

const isInt = (x: string) => /^\d+$/.test(x)
const convertInt = (x: string) => (isInt(x) ? parseInt(x, 10) : x)
const splitConnection = (connection: string) => connection.split(' ').reverse()
const convertConnection = (connection: string[]) => {
  return {
    left: convertInt(connection[4]),
    right: convertInt(connection[2]),
    gate: connection[3] ?? null,
    target: connection[0],
  }
}

const isConnectionUntaken =
  (current: Connections) => (connection: Connection) =>
    current[connection.target] === undefined
const isValueFree = (current: Connections) => (value: number | string) =>
  typeof value !== 'string' || current[value] !== undefined
const isConnectionFree = (current: Connections) => {
  const checkValue = isValueFree(current)

  return ({ left, right }: Connection) => checkValue(left) && checkValue(right)
}

const gates: Record<string, (left: number, right: number) => number> = {
  AND: (left, right) => left & right,
  OR: (left, right) => left | right,
  NOT: (left, right) => ~right,
  LSHIFT: (left, right) => left << right,
  RSHIFT: (left, right) => left >> right,
  null: (left, right) => right,
}

const handleConnection = (
  wires: Record<string, number>,
  { left, right, gate, target }: Connection,
) => {
  const leftIn = typeof left === 'number' ? left : wires[left]
  const rightIn = typeof right === 'number' ? right : wires[right]

  wires[target] = gates[gate](leftIn, rightIn)

  return wires
}

export default (rows: string[]) => {
  const connections = rows.map(splitConnection).map(convertConnection)

  const findSingleWireConnection = (wire: string | number) =>
    connections.find(({ target }) => target === wire)
  const findConnections = ({ left, right }: Connection): Connection[] => {
    return findWireConnections(left).concat(...findWireConnections(right))
  }
  const findWireConnections = (wire: string | number) => {
    const direct = findSingleWireConnection(wire)
    if (direct === undefined) {
      return []
    }

    const nested = findConnections(direct)

    return nested.concat(direct)
  }

  const findNewFreeConnections = (current: Connections) =>
    connections
      .filter(isConnectionUntaken(current))
      .filter(isConnectionFree(current))

  let sortedConnections: Record<string, Connection> = {}

  while (sortedConnections['a'] === undefined) {
    findNewFreeConnections(sortedConnections).forEach(
      connection => (sortedConnections[connection.target] = connection),
    )
  }

  const result1 = Object.values(sortedConnections).reduce(
    handleConnection,
    {},
  ).a

  const replacement: Connection = {
    left: undefined,
    right: result1,
    gate: null,
    target: 'b',
  }

  const fixedMap = { ...sortedConnections, b: replacement }

  const result2 = Object.values(fixedMap).reduce(handleConnection, {}).a

  return [result1, result2, 46065, 14134]
}
