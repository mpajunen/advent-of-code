import { Input, List, Str } from '../common'

const isValid1 = ([min, max, letter, candidate]) =>
  List.isSorted([min, Str.charCount(letter, candidate), max])

const isValid2 = ([min, max, letter, candidate]) =>
  (candidate[min - 1] === letter) !== (candidate[max - 1] === letter)

type RowPattern = [number, number, string, string]

export default (rows: string[]) => {
  const passwords = rows.map(Input.parseByPattern<RowPattern>('%i-%i %w: %w'))

  const result1 = passwords.filter(isValid1).length
  const result2 = passwords.filter(isValid2).length

  return [result1, result2, 600, 245]
}
