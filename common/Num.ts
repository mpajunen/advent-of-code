import * as List from './List'

export const LARGE_VALUE = 999999999

export const digits = (n: number): number[] => String(n).split('').map(c => parseInt(c))

export const findFactors = num =>
  List.range(1, Math.floor(Math.sqrt(num)))
    .filter(n => num % n === 0)
    .reduce((acc, n) => [...acc, n, num / n], [])

export const isNumeric = n => parseFloat(n).toString() === n

export const product = (values: number[]): number =>
  values.reduce((a, b) => a * b, 1)

export const sum = (values: number[]): number =>
  values.reduce((a, b) => a + b, 0)
