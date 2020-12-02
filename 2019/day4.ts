import * as common from '../common/common'

type Check = (digits: number[]) => boolean

const hasAdjacent = (digits: number[]): boolean =>
  common.zipPairs(digits).some(([a, b]) => a === b)
const isIncreasing = (digits: number[]): boolean =>
  common.zipPairs(digits).every(([a, b]) => a <= b)
const hasPair = (digits: number[]): boolean =>
  Object.values(common.arrayCounts(digits)).includes(2)

const isMatch = (checks: Check[]) => (num: number): boolean => {
  const digits = common.digits(num)

  return checks.every(check => check(digits))
}

export default function day4([row]: string[]): [unknown, unknown] {
  const [start, end] = common.parseByPattern('%i-%i')(row)

  const numbers = common.range(start, end + 1)

  return [
    numbers.filter(isMatch([hasAdjacent, isIncreasing])).length, // 945
    numbers.filter(isMatch([hasPair, isIncreasing])).length, // 617
  ]
}
