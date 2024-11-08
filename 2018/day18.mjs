import { Grid, List, Vec2 } from '../common'

const OPEN = '.'
const TREE = '|'
const YARD = '#'

const getAdjacent = (grid, position) =>
  Vec2.allAdjacent(position).map(p => grid.get(p))

const transforms = {
  [OPEN]: adjacent => (adjacent[TREE] >= 3 ? TREE : OPEN),
  [TREE]: adjacent => (adjacent[YARD] >= 3 ? YARD : TREE),
  [YARD]: adjacent =>
    adjacent[YARD] >= 1 && adjacent[TREE] >= 1 ? YARD : OPEN,
}

const transform = (value, place, grid) => {
  const adjacent = List.counts(getAdjacent(grid, place))

  return transforms[value](adjacent)
}

const passTime = (start, time) =>
  List.range(0, time).reduce(grid => grid.map(transform), start)

const totalValue = grid => {
  const counts = grid.valueCounts()

  return counts[TREE] * counts[YARD]
}

const TOTAL_TIME = 1000000000
const CYCLE_LENGTH = 28
const CYCLE_START = 560 // Not the actual start, just a value far enough forward with a matching phase (28 * 20)

const end = (TOTAL_TIME % CYCLE_LENGTH) + CYCLE_START

export default rows => {
  const input = Grid.fromStrings(rows)

  const passed = passTime(input, 10)
  const phased = passTime(input, end)

  const result1 = totalValue(passed)
  const result2 = totalValue(phased)

  return [result1, result2, 614812, 212176]
}
