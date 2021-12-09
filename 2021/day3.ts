import { Grid, Num } from '../common'

const getInput = (rows: string[]) => rows.map(r => r.split('').map(Number))

const getCommonValue = (column: number[]) => Num.sum(column) >= column.length / 2 ? 1 : 0

const findCommon = (most: boolean, rows: number[][], index = 0): number[] => {
  const column = new Grid(rows).column(index)
  const common = getCommonValue(column)

  const remaining = rows.filter(row => (row[index] === common) === most)

  return remaining.length === 1 ? remaining[0] : findCommon(most, remaining, index + 1)
}

const decimal = (bits: number[]): number => parseInt(bits.join(''), 2)

export default (rows: string[]) => {
  const input = getInput(rows)

  const columns = new Grid(input).columns()

  const gamma = columns.map(getCommonValue)
  const epsilon = columns.map(column => getCommonValue(column) ? 0 : 1)

  const oxygen = findCommon(true, input)
  const co2 = findCommon(false, input)

  const result1 = decimal(gamma) * decimal(epsilon)
  const result2 = decimal(oxygen) * decimal(co2)

  return [result1, result2, 2498354, 3277956]
}
