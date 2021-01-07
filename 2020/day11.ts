import { Grid, List, Vec2 } from '../common'

enum Square { floor = '.', empty = 'L', occupied = '#' }

type Data = Grid.Grid<Square>
type Step = (grid: Data) => Data

type GetNear = (grid: Data, pos: Vec2.Vec2) => Square[]

const getAdjacent: GetNear = (grid, position) =>
  Vec2.allAdjacent(position).map(pos => grid.get(pos)).filter(v => v !== undefined)

const getVisible: GetNear = (grid, pair) => {
  const one = (position: Vec2.Vec2, direction: Vec2.Vec2): Square | undefined => {
    const next = Vec2.add(position, direction)
    const square = grid.get(next)

    return square === Square.floor ? one(next, direction) : square
  }

  return Vec2.allList.map(direction => one(pair, direction))
}

const createStep = (limit: number, find: GetNear): Step => grid =>
  grid.map((value, position) => {
    const near = find(grid, position)
    const occupied = List.counts(near)[Square.occupied] ?? 0

    if (value === Square.empty && occupied === 0) {
      return Square.occupied
    }
    if (value === Square.occupied && occupied >= limit) {
      return Square.empty
    }

    return value
  })

const getCount = (state: Data): number => state.valueCounts()[Square.occupied]

const stepUntil = (start: Data, step: Step) => {
  let previous
  let value = start

  do {
    previous = value
    value = step(value)
  } while (getCount(value) !== getCount(previous))

  return value
}

export default (rows: string[]) => {
  const original = new Grid.Grid(rows.map(r => r.split('') as Square[]))

  const result1 = getCount(stepUntil(original, createStep(4, getAdjacent)))
  const result2 = getCount(stepUntil(original, createStep(5, getVisible)))

  return [result1, result2, 2424, 2208]
}
