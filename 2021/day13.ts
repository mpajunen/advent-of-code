import { Grid, Input, List, Vec2 } from '../common'

const getInput = (rows: string[]) => {
  const [dots, folds] = List.splitBy(v => v === '', rows)

  return {
    dots: dots.map(d => d.split(',').map(Number)).map(([x, y]) => ({ x, y })),
    folds: folds.map(Input.parseByPattern<Fold>('fold along %w=%i')),
  }
}

type Fold = ['x' | 'y', number]

const foldDot = ([axis, coord]: Fold) => (dot: Vec2): Vec2 =>
  dot[axis] < coord ? dot : ({ ...dot, [axis]: 2 * coord - dot[axis] })

const foldDots = (dots: Vec2[], fold: Fold) => dots.map(foldDot(fold))

const gridLimits = (dots: Vec2[]): Vec2 => ({
  x: List.maxBy(v => v.x, dots)[0].x + 1,
  y: List.maxBy(v => v.y, dots)[0].y + 1,
})

const solve = (dotsStart: Vec2[], folds: Fold[]) => {
  const dots = folds.reduce(foldDots, dotsStart)

  return Grid.create<'.' | '#'>({
    ...gridLimits(dots),
    getValue: position => dots.some(Vec2.equal(position)) ? '#' : '.',
  })
}

export default (rows: string[]) => {
  const input = getInput(rows)

  const foldedOnce = solve(input.dots, [input.folds[0]])
  const folded = solve(input.dots, input.folds)

  const result1 = foldedOnce.valueCounts()['#']
  const result2 = folded.stringGrid() // PERCGJPB

  return [result1, result2, 781, undefined]
}
