import { List, Num, Str } from '../common'

const getInput = (rows: string[]) =>
  rows.flatMap(row => row === 'noop' ? [0] : [0, Number(row.slice(5))])

const cycles = [20, 60, 100, 140, 180, 220]

const WIDTH = 40

const pixel = (value: number, index: number) => Math.abs(index % WIDTH - value) <= 1 ? '#' : '.'

export default (rows: string[]) => {
  const changes = [0, ...getInput(rows)] // First instruction is applied _after_ the first cycle

  const registerValues = List.scan(1, changes, (a, b) => a + b)

  const result1 = Num.sum(cycles.map(cycle => cycle * registerValues[cycle - 1]))
  const result2 = Str.chunk(WIDTH, registerValues.map(pixel).join('')).join('\n')

  return [result1, result2, 17180, CHECK_RESULT_2]
}

const CHECK_RESULT_2 = `
###..####.#..#.###..###..#....#..#.###..
#..#.#....#..#.#..#.#..#.#....#..#.#..#.
#..#.###..####.#..#.#..#.#....#..#.###..
###..#....#..#.###..###..#....#..#.#..#.
#.#..#....#..#.#....#.#..#....#..#.#..#.
#..#.####.#..#.#....#..#.####..##..###..
`.trim()
