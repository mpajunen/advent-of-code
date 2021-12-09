import { Grid, List, Vec2 } from '../common'

const units = {
  e: { x: 1, y: 0 },
  se: { x: 0, y: 1 },
  sw: { x: -1, y: 1 },
  w: { x: -1, y: 0 },
  nw: { x: 0, y: -1 },
  ne: { x: 1, y: -1 },
} as const

const unitValues = Object.values(units)

type Dir = keyof typeof units
type BlackValue = 0 | 1
type Data = Grid<BlackValue>

const parseRow = (row: string) => Array.from(row.match(/(se|sw|ne|nw|e|w)/g)) as Dir[]

const getTile = (directions: Dir[]): Vec2.Vec2 =>
  directions.map(dir => units[dir]).reduce(Vec2.add, Vec2.origin)

const SIZE = 200
const OFFSET = { x: SIZE / 2, y: SIZE / 2 }

const getGrid = (tiles: Vec2.Vec2[]) => {
  const row: BlackValue[] = new Array(SIZE).fill(0)
  const rows: BlackValue[][] = new Array(SIZE).fill(row).map(() => [...row])
  const grid = new Grid(rows)

  const offsetTiles = tiles.map(t => Vec2.add(OFFSET, t))

  for (const tile of offsetTiles) {
    grid.set(tile, grid.get(tile) === 1 ? 0 : 1)
  }

  return grid
}

const flip = (grid: Data): Data => {
  const getAdjacentCount = (tile: Vec2.Vec2): number => {
    const adjacent = unitValues.map(u => Vec2.add(u, tile)).map(pos => grid.get(pos))

    return List.counts(adjacent)[1] ?? 0
  }

  return grid.map((color, pos) => {
    const count = getAdjacentCount(pos)

    return color === 1
      ? (count === 1 || count === 2 ? 1 : 0)
      : (count === 2 ? 1 : 0)
  })
}

const flipTimes = (grid: Data, times: number): Data =>
  List.range(0, times).reduce(flip, grid)

export default (rows: string[]) => {
  const input = rows.map(parseRow)
  const tiles = input.map(getTile)
  const grid = getGrid(tiles)
  const flipped = flipTimes(grid, 100)

  const result1 = grid.valueCounts()[1]
  const result2 = flipped.valueCounts()[1]

  return [result1, result2, 473, undefined]
}
