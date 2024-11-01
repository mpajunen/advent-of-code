import { Input, List, Num } from '../common'

type Check = (digits: number[]) => boolean

const hasAdjacent = (digits: number[]): boolean =>
  List.zipPairs(digits).some(([a, b]) => a === b)
const isIncreasing = (digits: number[]): boolean =>
  List.zipPairs(digits).every(([a, b]) => a <= b)
const hasPair = (digits: number[]): boolean =>
  Object.values(List.counts(digits)).includes(2)

const isMatch =
  (checks: Check[]) =>
  (num: number): boolean => {
    const digits = Num.digits(num)

    return checks.every(check => check(digits))
  }

export default function day4([row]: string[]): [unknown, unknown] {
  const [start, end] = Input.parseByPattern<[number, number]>('%i-%i')(row)

  const numbers = List.range(start, end + 1)

  return [
    numbers.filter(isMatch([hasAdjacent, isIncreasing])).length, // 945
    numbers.filter(isMatch([hasPair, isIncreasing])).length, // 617
  ]
}
