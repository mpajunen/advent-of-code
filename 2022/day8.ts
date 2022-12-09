import { Grid, Num, Vec2 } from '../common'

const getInput = (rows: string[]) =>
  new Grid(rows.map(row => row.split('').map(Number)))

const getTreeLinesFrom = (grid: Grid<number>, { x, y }: Vec2) => {
  const row = grid.row(y)
  const column = grid.column(x)

  return [
    row.slice(0, x).reverse(),
    row.slice(x + 1),
    column.slice(0, y).reverse(),
    column.slice(y + 1),
  ]
}

const isVisibleFromEdge = (height: number, position: Vec2, grid: Grid<number>) =>
  getTreeLinesFrom(grid, position).some(trees => Math.max(...trees) < height)

const getDirectionScore = (height: number, trees: number[]) =>
  trees.findIndex(tree => tree >= height) + 1 || trees.length

const getScenicScore = (height: number, position: Vec2, grid: Grid<number>) =>
  Num.product(getTreeLinesFrom(grid, position).map(trees => getDirectionScore(height, trees)))

export default (rows: string[]) => {
  const grid = getInput(rows)

  const result1 = grid.countBy(isVisibleFromEdge)
  const result2 = grid.map(getScenicScore).findMax().max

  return [result1, result2, 1662, 537600]
}
