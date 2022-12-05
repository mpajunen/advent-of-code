import { Grid, List, Num, Str } from '../common'

const getInput = (rows: string[]) => {
  const [first, ...rest] = List.splitBy('', rows)
  const draws = allDraws(first[0].split(',').map(Number))
  const boards = rest.map(board => new Grid(board.map(row => Str.words(row).map(Number))))

  return { draws, boards }
}

const allDraws = (drawOrder: number[]): number[][] =>
  List.range(5, drawOrder.length).map(drawn => drawOrder.slice(0, drawn))

const allLines = (board: Grid<number>): number[][] => [
  ...board.rows(),
  ...board.columns(),
  ...board.diagonals(),
]

const score = (draws: number[][]) => (board: Grid<number>) => {
  const lines = allLines(board)

  for (const draw of draws) {
    if (lines.some(line => List.intersection(line, draw).length === 5)) {
      const last = draw[draw.length - 1]
      const remaining = List.exclude(board.values(), draw)
      const score = last * Num.sum(remaining)

      return { score, drawn: draw.length }
    }
  }
}

export default (rows: string[]) => {
  const input = getInput(rows)

  const scores = input.boards.map(score(input.draws))

  const result1 = List.minBy(v => v.drawn, scores)[0].score
  const result2 = List.maxBy(v => v.drawn, scores)[0].score

  return [result1, result2, 35670, 22704]
}
