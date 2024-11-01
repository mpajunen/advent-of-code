import { Grid, Num, Vec2 } from '../common'

const getInput = (rows: string[]) =>
  new Grid(rows.map(r => r.split('').map(Number)))

const createPaths = (size: number) =>
  Grid.create<number>({ x: size, y: size }, ({ x, y }) =>
    x === 0 && y === 0 ? 0 : Num.LARGE_VALUE,
  )

const solve = (costs: Grid<number>): number => {
  const size = costs.row(0).length
  const paths = createPaths(size)

  const positionsByCost: Record<number, Vec2[]> = { 0: [{ x: 0, y: 0 }] }
  let currentCost = 0
  let maxCost = 0

  while (currentCost <= maxCost) {
    const positions = positionsByCost[currentCost] ?? []

    for (const from of positions) {
      for (const to of Vec2.adjacent(from)) {
        const oldCost = paths.get(to)
        if (!oldCost || oldCost !== Num.LARGE_VALUE) {
          continue // If path cost is set, it's also optimal
        }

        const newCost = currentCost + costs.get(to)

        paths.set(to, newCost)
        positionsByCost[newCost] = positionsByCost[newCost] ?? []
        positionsByCost[newCost].push(to)

        maxCost = Math.max(maxCost, newCost)
      }
    }

    currentCost += 1
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
    start.map(v => v + modifier).map(v => (v > 9 ? v - 9 : v))

  const subGrids = changes.map(row => row.map(modify))

  return Grid.combine(subGrids)
}

export default (rows: string[]) => {
  const costs = getInput(rows)

  const result1 = solve(costs)
  const result2 = solve(buildMegaGrid(costs))

  return [result1, result2, 386, 2806]
}
