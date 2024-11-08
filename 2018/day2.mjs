import { Str } from '../common'

const hasCount = count => counts =>
  Object.entries(counts).some(([_, value]) => value === count)

const findNumberWithCount = (rowLetterCounts, count) =>
  rowLetterCounts.filter(hasCount(count)).length

const findSameChars = word1 => word2 =>
  word2
    .split('')
    .filter((char, i) => char === word1[i])
    .join('')

const findMostMatchingPart = rows => {
  for (const word1 of rows) {
    for (const word2 of rows) {
      const same = findSameChars(word1)(word2)
      if (same.length === word1.length - 1) {
        return same
      }
    }
  }
}

export default rows => {
  const rowLetterCounts = rows.map(Str.charCounts)

  const result1 =
    findNumberWithCount(rowLetterCounts, 2) *
    findNumberWithCount(rowLetterCounts, 3)
  const result2 = findMostMatchingPart(rows)

  return [result1, result2, 9633, 'lujnogabetpmsydyfcovzixaw']
}
