import { Grid, Line, List, Vec2 } from '../common'

type Cell = '.' | '#' | 'O'

const ROCK_SOURCE = { x: 500, y: 0 }
const X_MAX = 1000

const getRockPathPoints = (coordinates: string[]): Vec2[] =>
  coordinates.map(part => Vec2.fromTuple(part.split(',').map(Number)))

const addFloor = (grid: Grid<Cell>) => {
  const rows = grid.copy().rows()
  rows.push(List.repeat('.', rows[0].length))
  rows.push(List.repeat('#', rows[0].length))

  return new Grid(rows)
}

const getInput = (rows: string[]): Grid<Cell> => {
  const rockPaths = rows.map(row => getRockPathPoints(row.split(' -> ')))
  const rockPoints = rockPaths
    .flatMap(List.zipPairs)
    .map(Line.fromTuple)
    .flatMap(Line.points)

  const maxY = Math.max(...rockPaths.flat().map(p => p.y))

  const grid = Grid.create<Cell>({ x: X_MAX, y: maxY + 1 }, () => '.')
  for (const point of rockPoints) {
    grid.set(point, '#')
  }

  return grid
}

const MOVES: Vec2[] = [{ x: 0, y: 1 }, { x: -1, y: 1 }, { x: 1, y: 1 }]

const fillWithSand = (grid: Grid<Cell>) => {
  const findAdjacentPosition = (position: Vec2): Vec2 | undefined =>
    MOVES.map(move => Vec2.add(position, move)).find(p => grid.get(p) === '.')

  const findNextSandPosition = (position: Vec2 = ROCK_SOURCE) => {
    if (position.y === grid.size().y - 1) {
      return undefined
    }

    const next = findAdjacentPosition(position)

    return next ? findNextSandPosition(next) : position
  }

  while (true) {
    const sand = findNextSandPosition()
    if (sand) {
      grid.set(sand, 'O')
      if (sand.y === 0) {
        break
      }
    } else {
      break
    }
  }

  return grid
}

export default (rows: string[]) => {
  const grid = getInput(rows)

  const result1 = fillWithSand(grid).valueCounts()['O']
  const result2 = fillWithSand(addFloor(grid)).valueCounts()['O']

  return [result1, result2, 795, 30214]
}
