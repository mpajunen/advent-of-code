import * as common from './common'
import Grid from './Grid'

const readInput = raw => {
  const grid = new Grid(raw.map(row => row.split('')))

  return { grid }
}

const OPEN = '.'
const TREE = '|'
const YARD = '#'

const getAdjacent = (grid, [x, y]) => [
  grid.get([x - 1, y - 1]),
  grid.get([x + 0, y - 1]),
  grid.get([x + 1, y - 1]),
  grid.get([x - 1, y + 0]),
  // grid.get([x + 0, y + 0]),
  grid.get([x + 1, y + 0]),
  grid.get([x - 1, y + 1]),
  grid.get([x + 0, y + 1]),
  grid.get([x + 1, y + 1]),
]

const transforms = {
  [OPEN]: adjacent => (adjacent[TREE] >= 3 ? TREE : OPEN),
  [TREE]: adjacent => (adjacent[YARD] >= 3 ? YARD : TREE),
  [YARD]: adjacent =>
    adjacent[YARD] >= 1 && adjacent[TREE] >= 1 ? YARD : OPEN,
}

const transform = grid => (value, place) => {
  const adjacent = common.arrayCounts(getAdjacent(grid, place))

  return transforms[value](adjacent)
}

const passTime = (start, time) => {
  let grid = start

  let t = 0

  let max = 0
  let maxAt = []

  while (t < time) {
    t += 1
    grid = grid.map(transform(grid))

    const value = totalValue(grid)
    if (value > max) {
      max = value
      maxAt = [t]
    } else if (value === max) {
      maxAt.push(t)
    }
  }

  return { grid, max, maxAt: maxAt.pop() }
}

const totalValue = grid => {
  const counts = grid.valueCounts()

  return counts[TREE] * counts[YARD]
}

const TOTAL_TIME = 1000000000
const CYCLE_LENGTH = 28
const CYCLE_START = 560 // Not the actual start, just a value far enough forward with a matching phase (28 * 20)

const end = (TOTAL_TIME % CYCLE_LENGTH) + CYCLE_START

export default rows => {
  const input = readInput(rows)

  const passed = passTime(input.grid, 10)
  const phased = passTime(input.grid, end)

  const result1 = totalValue(passed.grid)
  const result2 = totalValue(phased.grid)

  return [result1, result2, 614812, 212176]
}
