'use strict'

const R = require('ramda')

const input =
  //= 'abcdefgh'
  //= 'ghjaaaaa'
  //= 'ghijklmn'
  //= 'xcrrq'
  'hepxcrrq'

const alphabet = R.range('a'.charCodeAt(0), 'z'.charCodeAt(0) + 1).map(code =>
  String.fromCharCode(code),
)

const numBase = alphabet.length

const getLetterIndex = char => alphabet.indexOf(char)

//console.log(alphabet)

const decode = pw => pw.split('').map(getLetterIndex)

const encode = nums => nums.map(num => alphabet[num]).join('')

const decoded = decode(input)

const invalidLetters = ['i', 'o', 'l'].map(getLetterIndex)

const getNext = nums => {
  let lastDigit = nums.slice(-1)[0]
  const remaining = nums.slice(0, -1)

  lastDigit += 1
  if (invalidLetters.includes(lastDigit)) {
    lastDigit += 1
  }

  return lastDigit === numBase
    ? getNext(remaining).concat([0])
    : remaining.concat([lastDigit])
}

const hasNoInvalidLetters = nums =>
  nums.filter(num => invalidLetters.indexOf(num) !== -1).length === 0

const hasIncreasingStraight = nums =>
  nums
    .map(
      (value, key, nums) =>
        nums[key + 1] === value + 1 && nums[key + 2] === value + 2,
    )
    .includes(true)

const getFirstPairIndex = nums =>
  nums.reduce(
    (index, value, key, nums) =>
      index === -1 && nums[key + 1] === value ? key : index,
    -1,
  )
const hasTwoPairs = nums => {
  const first = getFirstPairIndex(nums)

  return first !== -1 && getFirstPairIndex(nums.slice(first + 2)) !== -1
}

const filters = [
  //hasNoInvalidLetters,
  hasIncreasingStraight,
  hasTwoPairs,
]

const isValidPw = nums =>
  filters.reduce((init, filter) => init && filter(nums), true)

const getNextValidPw = nums => {
  do {
    nums = getNext(nums)
  } while (!isValidPw(nums))

  return nums
}

var nums = decoded

const newPw = encode(getNextValidPw(nums))

const nextPw = encode(getNextValidPw(decode(newPw)))

console.log(newPw)
console.log(nextPw)
