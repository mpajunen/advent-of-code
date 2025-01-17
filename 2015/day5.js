'use strict'

const vowels = 'aeiou'.split('')
const disallowedPairs = ['ab', 'cd', 'pq', 'xy'].map(pair => pair.split(''))
const disallowed = new Map(disallowedPairs)

const isCharVowel = char => vowels.indexOf(char) !== -1
const getWordVowels = word => word.filter(isCharVowel)
const isPreviousSame = (char, index, word) =>
  index !== 0 && word[index - 1] === char
const isPairBad = (current, previous) =>
  disallowed.has(previous) && disallowed.get(previous) === current
const isPreviousBad = (char, index, word) =>
  index !== 0 && isPairBad(char, word[index - 1])

const hasEnoughVowels = word => getWordVowels(word).length >= 3
const hasDoubleChar = word => word.filter(isPreviousSame).length > 0
const hasNoBad = word => word.filter(isPreviousBad).length === 0

const getPair = (char, index, word) =>
  index > 0 ? word[index - 1] + char : null
const toPairs = word => word.map(getPair).slice(1)
const hasDoublePairs = word => {
  const pairs = toPairs(word)
  const hasPair = (subWord, pair) => subWord.includes(pair)
  const hasPrecedingPair = (pair, index) => {
    if (index < 2) {
      return false
    }

    const subWord = pairs.slice(0, index - 1)

    return hasPair(subWord, pair)
  }

  return pairs.filter(hasPrecedingPair).length > 0
}
const isGapRepeater = (char, index, word) =>
  index > 1 && word[index - 2] === char
const hasGapRepeat = word => word.filter(isGapRepeater).length > 0

export default rows => {
  const words = rows.map(line => line.split(''))

  const goodWords = words
    .filter(hasEnoughVowels)
    .filter(hasDoubleChar)
    .filter(hasNoBad)
    .map(word => word.join(''))

  const result1 = goodWords.length

  const betterWords = words
    .filter(hasDoublePairs)
    .filter(hasGapRepeat)
    .map(word => word.join(''))

  const result2 = betterWords.length

  return [result1, result2, 255, 55]
}
