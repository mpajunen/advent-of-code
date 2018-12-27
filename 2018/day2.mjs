import * as common from './common'

const rows = common.readDayRows(2)

const letterCounts = text => common.arrayCounts(text.split(''))

const hasCount = count => counts =>
  Object.entries(counts).some(([_, value]) => value === count)

const rowLetterCounts = rows.map(letterCounts)

const findNumberWithCount = count =>
  rowLetterCounts.filter(hasCount(count)).length

const result1 = findNumberWithCount(2) * findNumberWithCount(3)

console.log(result1) // 9633


const findSameChars = word1 => word2 =>
  word2.split('').filter((char, i) => char === word1[i]).join('')

const findMostMatchingPart = () => {
  for (const word1 of rows) {
    for (const word2 of rows) {
      const same = findSameChars(word1)(word2)
      if (same.length === word1.length - 1) {
        return same
      }
    }
  }
}

const result2 = findMostMatchingPart()

console.log(result2) // lujnogabetpmsydyfcovzixaw
