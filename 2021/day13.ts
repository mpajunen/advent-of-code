import { Grid, Input, List, Vec2 } from '../common'

const getInput = (rows: string[]) => {
  const [dots, folds] = List.splitBy('', rows)

  return {
    dots: dots.map(Vec2.fromString),
    folds: folds.map(Input.parseByPattern<Fold>('fold along %w=%i')),
  }
}

type Fold = ['x' | 'y', number]

const foldDot = ([axis, coord]: Fold) => (dot: Vec2): Vec2 =>
  dot[axis] < coord ? dot : ({ ...dot, [axis]: 2 * coord - dot[axis] })

const foldDots = (dots: Vec2[], fold: Fold) => dots.map(foldDot(fold))

const gridLimits = (dots: Vec2[]): Vec2 => ({
  x: Math.max(...dots.map(d => d.x)) + 1,
  y: Math.max(...dots.map(d => d.y)) + 1,
})

const solve = (initialDots: Vec2[], folds: Fold[]) => {
  const dots = folds.reduce(foldDots, initialDots)

  return Grid.create(gridLimits(dots), position => dots.some(Vec2.equal(position)) ? '#' : '.')
}

export default (rows: string[]) => {
  const { dots, folds } = getInput(rows)

  const result1 = List.unique(foldDots(dots, folds[0]).map(Vec2.toString)).length
  const result2 = solve(dots, folds).stringGrid() // PERCGJPB

  return [result1, result2, 781, undefined]
}
