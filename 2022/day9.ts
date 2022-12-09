import { List, Vec2 } from '../common'
import { Dir, Move } from '../common/Vec2'

type State = { rope: Vec2[], tailVisited: Vec2[] }

const getInput = (rows: string[]) =>
  rows.map(row => ({ dir: row[0], length: Number(row.slice(2)) }))

const clampDir = (n: number) => n > 1 ? 1 : n < -1 ? -1 : n
const clampChange = ({ x, y }: Vec2) => ({ x: clampDir(x), y: clampDir(y) })

const isAdjacent = ({ x, y }: Vec2) => Math.abs(x) <= 1 && Math.abs(y) <= 1

const getNextPosition = (tail: Vec2, target: Vec2): Vec2 => {
  const diff = Vec2.subtract(target, tail)

  return isAdjacent(diff) ? tail : Vec2.add(tail, clampChange(diff))
}

const moveRope = ([head, ...tail]: Vec2[], step: Vec2) =>
  tail.reduce(
    (rope, section) => [...rope, getNextPosition(section, rope[rope.length - 1])],
    [Vec2.add(head, step)],
  )

const takeStep = (state: State, step: Vec2): State => {
  const rope = moveRope(state.rope, step)
  const tailVisited = [...state.tailVisited, rope[rope.length - 1]]

  return { rope, tailVisited }
}

const createState = (ropeLength: number): State => ({
  rope: List.range(0, ropeLength).map(() => Vec2.origin),
  tailVisited: [Vec2.origin],
})

const covered = (s: State) => new Set(s.tailVisited.map(p => `${p.x},${p.y}`)).size

export default (rows: string[]) => {
  const steps = getInput(rows)
    .flatMap(({ dir, length }) => List.repeat<Vec2>(Vec2.screenUnits[dir], length))

  const result1 = covered(steps.reduce(takeStep, createState(2)))
  const result2 = covered(steps.reduce(takeStep, createState(10)))

  return [result1, result2, 6470, 2658]
}
