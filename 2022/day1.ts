import { List, Num } from '../common'

const getInput = (rows: string[]) =>
  List.splitBy('', rows).map(chunk => chunk.map(Number))

export default (rows: string[]) => {
  const input = getInput(rows)

  const top = List.sort(input.map(Num.sum)).reverse()

  const result1 = top[0]
  const result2 = Num.sum(top.slice(0, 3))

  return [result1, result2, 69206, 197400]
}
