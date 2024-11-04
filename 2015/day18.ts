import { Grid, List, Vec2 } from '../common'

type Cell = '#' | '.'
type GridStep = (grid: Grid<Cell>) => Grid<Cell>

const STEPS = 100

const stepCell = (cell: Cell, position: Vec2, grid: Grid<Cell>) => {
  const litNeighbors = Vec2.allAdjacent(position)
    .map(p => grid.get(p))
    .filter(c => c === '#').length

  return (litNeighbors === 2 && cell === '#') || litNeighbors === 3 ? '#' : '.'
}

const stepGrid1: GridStep = grid => grid.map(stepCell)

const stepGrid2: GridStep = grid => setStuck(grid.map(stepCell))

const setStuck = (grid: Grid<Cell>) => {
  grid.corners().forEach(p => grid.set(p, '#'))

  return grid
}

const stepAndCountLit = (initial: Grid<Cell>, step: GridStep) =>
  List.range(0, STEPS)
    .reduce(step, initial)
    .countBy(c => c === '#')

export default (rows: string[]) => {
  const initial = Grid.fromStrings<Cell>(rows)

  const result1 = stepAndCountLit(initial, stepGrid1)
  const result2 = stepAndCountLit(setStuck(initial.copy()), stepGrid2)

  return [result1, result2, 814, 924]
}
