import { List, Num } from '../common'

const SNAFU_BASE = 5
const SNAFU_TO_DEC = { 2: 2, 1: 1, 0: 0, '-': -1, '=': -2 }
const DEC_TO_SNAFU = { 2: 2, 1: 1, 0: 0, '-1': '-', '-2': '=' }

const toDecimalDigit = (digit: string, index: number) =>
  SNAFU_TO_DEC[digit] * SNAFU_BASE ** index

const toDecimal = (snafu: string) =>
  Num.sum(snafu.split('').reverse().map(toDecimalDigit))

const getSnafuDigitCount = (decimal: number) =>
  List.range(0, 100).find(n => decimal * 2 < SNAFU_BASE ** n)

const toSnafu = (decimal: number) => {
  const positions = List.range(0, getSnafuDigitCount(decimal))
  const [digits] = positions.reduce(
    ([digits, current], position) => {
      const place = SNAFU_BASE ** position
      const remainder = (current % (place * SNAFU_BASE)) / place
      const digit = remainder > 2 ? remainder - SNAFU_BASE : remainder

      return [DEC_TO_SNAFU[digit] + digits, current - digit * place]
    },
    ['', decimal],
  )

  return digits
}

export default (rows: string[]) => {
  const result1 = toSnafu(Num.sum(rows.map(toDecimal)))

  return [result1, undefined, '2011-=2=-1020-1===-1', undefined]
}
