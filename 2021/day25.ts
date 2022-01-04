import { Grid, Vec2 } from '../common'

type Cell = '>' | 'v' | '.'

const getInput = (rows: string[]) =>
  new Grid(rows.map(r => r.split('') as Cell[]))

const stepEast = (grid: Grid<Cell>): Grid<Cell> => {
  const X_MAX = grid.size().x - 1

  const changes: Record<Cell, (position: Vec2) => Cell> = {
    '.': ({ x, y }) =>
      grid.get({ x: x === 0 ? X_MAX : x - 1, y }) === '>' ? '>' : '.',
    '>': ({ x, y }) =>
      grid.get({ x: x === X_MAX ? 0 : x + 1, y }) === '.' ? '.' : '>',
    'v': () => 'v',
  }

  return grid.map((value, position) => changes[value](position))
}

const stepSouth = (grid: Grid<Cell>): Grid<Cell> => {
  const Y_MAX = grid.size().y - 1

  const changes: Record<Cell, (position: Vec2) => Cell> = {
    '.': ({ x, y }) =>
      grid.get({ x, y: y === 0 ? Y_MAX : y - 1 }) === 'v' ? 'v' : '.',
    '>': () => '>',
    'v': ({ x, y }) =>
      grid.get({ x, y: y === Y_MAX ? 0 : y + 1 }) === '.' ? '.' : 'v',
  }

  return grid.map((value, position) => changes[value](position))
}

const step = (grid: Grid<Cell>): Grid<Cell> => stepSouth(stepEast(grid))

const stepsToStop = (start: Grid<Cell>): number => {
  let grid = start
  let steps = 0

  let previous
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
  const input = getInput(rows)

  const result1 = stepsToStop(input)
  const result2 = 0

  return [result1, result2, 582, undefined]
}
