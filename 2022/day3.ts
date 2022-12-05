import { List, Num, Str } from '../common'

const itemPriorities = ' ' + Str.alphabet + Str.alphabet.toUpperCase()
const priority = (item: string) => itemPriorities.indexOf(item)

export default (rows: string[]) => {
  const misplaced = rows.map(sack => Str.commonChars(...Str.splitIn(sack, 2)))

  const badges = List.chunk(rows, 3).map(group => Str.commonChars(...group))

  const result1 = Num.sum(misplaced.map(priority))
  const result2 = Num.sum(badges.map(priority))

  return [result1, result2, 7878, 2760]
}
