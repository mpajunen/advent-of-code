import { List, Vec2 } from '../common'

const getInput = (rows: string[]) =>
  rows.map(row => ({ dir: row[0], length: Number(row.slice(2)) }))

const clampDir = (n: number) => n > 1 ? 1 : n < -1 ? -1 : n
const clampChange = ({ x, y }: Vec2) => ({ x: clampDir(x), y: clampDir(y) })

const isAdjacent = ({ x, y }: Vec2) => Math.abs(x) <= 1 && Math.abs(y) <= 1

const getNextPosition = (tail: Vec2, target: Vec2): Vec2 => {
  const diff = Vec2.subtract(target, tail)

  return isAdjacent(diff) ? tail : Vec2.add(tail, clampChange(diff))
}

const getNextPositions = (previousKnot: Vec2[]): Vec2[] =>
  List.scan(Vec2.origin, previousKnot, getNextPosition)

const covered = (visited: Vec2[]) => new Set(visited.map(p => `${p.x},${p.y}`)).size

export default (rows: string[]) => {
  const steps = getInput(rows)
    .flatMap(({ dir, length }) => List.repeat<Vec2>(Vec2.screenUnits[dir], length))

  const headPositions = List.scan(Vec2.origin, steps, Vec2.add)

  const result1 = covered(getNextPositions(headPositions))
  const result2 = covered(List.range(1, 10).reduce(getNextPositions, headPositions))

  return [result1, result2, 6470, 2658]
}
