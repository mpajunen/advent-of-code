import { Grid, Num, Vec2 } from '../common'

const getInput = (rows: string[]) => new Grid(rows.map(r => r.split('').map(Number)))

const createPaths = (size: number) =>
  Grid.create<number>({ x: size, y: size }, ({ x, y }) => x === 0 && y === 0 ? 0 : Num.LARGE_VALUE)

const getAdjacent = (grid: Grid<number>, position: Vec2): number[] =>
  Vec2.adjacent(position).map(pos => grid.get(pos)).filter(v => v !== undefined)

const solve = (costs: Grid<number>): number => {
  const size = costs.row(0).length
  const paths = createPaths(size)

  let changes = true

  while (changes) {
    changes = false

    // Very naive and slow :)
    paths.mapMutate((value, position) => {
      const cost = costs.get(position)
      const adjacent = getAdjacent(paths, position)
      const newValue = Math.min(value, ...adjacent.map(a => a + cost))

      if (newValue !== value) {
        changes = true
      }

      return newValue
    })
  }

  return paths.get({ x: size - 1, y: size - 1 })
}

const buildMegaGrid = (start: Grid<number>): Grid<number> => {
  const changes = [
    [0, 1, 2, 3, 4],
    [1, 2, 3, 4, 5],
    [2, 3, 4, 5, 6],
    [3, 4, 5, 6, 7],
    [4, 5, 6, 7, 8],
  ]

  const modify = (modifier: number) =>
    start.map(v => v + modifier).map(v => v > 9 ? v - 9 : v)

  const subGrids = changes.map(row => row.map(modify))

  return Grid.combine(subGrids)
}

export default (rows: string[]) => {
  const costs = getInput(rows)

  const result1 = solve(costs)
  const result2 = solve(buildMegaGrid(costs))

  return [result1, result2, 386, 2806]
}
