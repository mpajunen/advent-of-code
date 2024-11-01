import { Grid, Vec2 } from '../common'

type Cell = '>' | 'v' | '.'

type GetCell = (position: Vec2) => Cell

const stepEast = (grid: Grid<Cell>): Grid<Cell> => {
  const X_MAX = grid.size().x - 1

  const east: GetCell = ({ x, y }) =>
    grid.get({ x: x === 0 ? X_MAX : x - 1, y })
  const west: GetCell = ({ x, y }) =>
    grid.get({ x: x === X_MAX ? 0 : x + 1, y })

  const changes: Record<Cell, (position: Vec2) => Cell> = {
    '.': p => (east(p) === '>' ? '>' : '.'),
    '>': p => (west(p) === '.' ? '.' : '>'),
    v: () => 'v',
  }

  return grid.map((value, position) => changes[value](position))
}

const stepSouth = (grid: Grid<Cell>): Grid<Cell> => {
  const Y_MAX = grid.size().y - 1

  const north: GetCell = ({ x, y }) =>
    grid.get({ x, y: y === 0 ? Y_MAX : y - 1 })
  const south: GetCell = ({ x, y }) =>
    grid.get({ x, y: y === Y_MAX ? 0 : y + 1 })

  const changes: Record<Cell, GetCell> = {
    '.': p => (north(p) === 'v' ? 'v' : '.'),
    '>': () => '>',
    v: p => (south(p) === '.' ? '.' : 'v'),
  }

  return grid.map((value, position) => changes[value](position))
}

const step = (grid: Grid<Cell>): Grid<Cell> => stepSouth(stepEast(grid))

const stepsToStop = (start: Grid<Cell>): number => {
  let grid = start
  let steps = 0

  let previous = undefined
  let current = grid.stringGrid()

  while (current !== previous) {
    grid = step(grid)
    steps += 1

    previous = current
    current = grid.stringGrid()
  }

  return steps
}

export default (rows: string[]) => {
  const input = Grid.fromStrings<Cell>(rows)

  const result1 = stepsToStop(input)

  return [result1, undefined, 582, undefined]
}
