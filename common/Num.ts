import * as List from './List'

export const LARGE_VALUE = 999999999

export const digits = (n: number): number[] => String(n).split('').map(c => parseInt(c))

export const fromDigits = (digits: number[]): number => Number(digits.join(''))

export const fibonacci = (n: number): number => n < 2 ? 1 : n * fibonacci(n - 1)

export const findFactors = num =>
  List.range(1, Math.ceil(Math.sqrt(num)))
    .filter(n => num % n === 0)
    .reduce((acc, n) => [...acc, n, num / n], [])

export const isNumeric = n => parseFloat(n).toString() === n

export const pairSums = (values: number[]): number[] => {
  const all = []

  for (let i = 0; i < values.length; i++) {
    for (let j = 0; j < i; j++) {
      all.push(values[i] + values[j])
    }
  }

  return List.unique(all)
}

export const product = (values: number[]): number =>
  values.reduce((a, b) => a * b, 1)

export const sum = (values: number[]): number =>
  values.reduce((a, b) => a + b, 0)
