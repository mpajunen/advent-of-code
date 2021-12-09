import { Grid, List, Num, Vec2 } from '../common'

const getInput = (rows: string[]) => new Grid(rows.map(r => r.split('').map(Number)))

type Entry = [Vec2.Vec2, number]

const adjacent = (grid: Grid<number>, source: Vec2.Vec2): Entry[] =>
  Vec2.adjacent(source).map((p): Entry => [p, grid.get(p)]).filter(([, value]) => value !== undefined)

const findLow = (grid: Grid<number>): Entry[] =>
  grid.entries().filter(([position, value]) => adjacent(grid, position).every(([, a]) => a > value))

const findBasin = (grid: Grid<number>) => (source: Vec2.Vec2): string[] => {
  const current = grid.get(source)
  const newParts = adjacent(grid, source)
    .filter(([, value]) => value > current && value < 9)
    .map(([position]) => position)

  return List.unique([`${source.x},${source.y}`, ...newParts.flatMap(findBasin(grid))])
}

export default (rows: string[]) => {
  const input = getInput(rows)

  const low = findLow(input)

  const basins = low.map(([position]) => position).map(findBasin(input))

  const result1 = Num.sum(low.map(([, value]) => value + 1))
  const result2 = Num.product(List.sort(basins.map(b => b.length)).slice(-3))

  return [result1, result2, 588, 964712]
}
