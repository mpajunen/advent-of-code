import { Input, List, Range } from '../common'

const getInput = (rows: string[]) =>
  rows
    .map(Input.parseByPattern('%i-%i,%i-%i'))
    .map(row => List.chunk(row, 2)) as [Range, Range][]

export default (rows: string[]) => {
  const input = getInput(rows)

  const result1 = input.filter(([a, b]) => Range.eitherContains(a, b)).length
  const result2 = input.filter(([a, b]) => Range.overlaps(a, b)).length

  return [result1, result2, 538, 792]
}
