import { Num, Str } from '../common'

const getInput = (rows: string[]) =>
  rows.map(row => row.split(' | ').map(part => Str.words(part).map(Str.sort)))

/*
  0:      1:      2:      3:      4:
 aaaa    ....    aaaa    aaaa    ....
b    c  .    c  .    c  .    c  b    c
b    c  .    c  .    c  .    c  b    c
 ....    ....    dddd    dddd    dddd
e    f  .    f  e    .  .    f  .    f
e    f  .    f  e    .  .    f  .    f
 gggg    ....    gggg    gggg    ....

  5:      6:      7:      8:      9:
 aaaa    aaaa    aaaa    aaaa    aaaa
b    .  b    .  .    c  b    c  b    c
b    .  b    .  .    c  b    c  b    c
 dddd    dddd    ....    dddd    dddd
.    f  e    f  .    f  e    f  .    f
.    f  e    f  .    f  e    f  .    f
 gggg    gggg    ....    gggg    gggg
 */

const NUMBER_SEGMENTS = [
  'abcefg',
  'cf',
  'acdeg',
  'acdfg',
  'bcdf',
  'abdfg',
  'abdefg',
  'acf',
  'abcdefg',
  'abcdfg',
]

const UNIQUE_LENGTHS = [2, 3, 4, 7] // 1, 4, 7, and 8

const refine = (real: string) => (options: string[], compare: [string, string[]]): string[] => {
  const commonCharCount = Str.commonChars(real, compare[0]).length

  return options.filter(o => compare[1].some(c => Str.commonChars(c, o).length === commonCharCount))
}

const solve = ([signal, output]: [string[], string[]]): number => {
  const possibilities: [string, string[]][] =
    NUMBER_SEGMENTS.map(s => [s, signal.filter(str => str.length === s.length)])

  const refined = possibilities.map(([real, options]) =>
    possibilities.reduce(refine(real), options)[0]) // Expects that only one match is found

  return Num.fromDigits(output.map(v => refined.indexOf(v)))
}

export default (rows: string[]) => {
  const input = getInput(rows)

  const result1 = Num.sum(input.map(([, output]) => output.filter(o => UNIQUE_LENGTHS.includes(o.length)).length))
  const result2 = Num.sum(input.map(solve))

  return [result1, result2, 521, 1016804]
}
