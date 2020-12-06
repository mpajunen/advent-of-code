import { List, Str } from '../common'

const digit = char => ['F', 'L'].includes(char) ? 0 : 1

const id = row => parseInt(Str.map(digit, row), 2)

const findGap = (ids: number[]) =>
  List.zipPairs(ids).find(([a, b]) => a + 1 !== b)

export default (rows: string[]) => {
  const ids = rows.map(id).sort()
  const [beforeGap] = findGap(ids)

  const result1 = Math.max(...ids)
  const result2 = beforeGap + 1

  return [result1, result2, 930, 515]
}
