import { List, Num } from '../common'

const getFormGroups = (rows: string[]): string[][][] =>
  List.splitBy(row => row === '', rows)
    .map(g => g.map(r => r.split('')))

export default (rows: string[]) => {
  const forms = getFormGroups(rows)

  const unique = forms
    .map(g => List.unique(g.flat()))
    .map(g => g.length)
  const result1 = Num.sum(unique)

  const common = forms
    .map(List.intersectionOf)
    .map(g => g.length)
  const result2 = Num.sum(common)

  return [result1, result2, 6249, 3103]
}
