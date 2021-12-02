import { List } from '../common'

export default (rows: string[]) => {
  const input = rows.map(Number)

  const result1 = List.zipPairs(input).filter(([a, b]) => b > a).length
  const result2 = List.zip(input, input.slice(3)).filter(([a, b]) => b > a).length

  return [result1, result2, 1655, 1683]
}
