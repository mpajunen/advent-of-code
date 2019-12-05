import * as fs from 'fs'

export const readDayRows = (year, day) =>
  fs.readFileSync(`./${year}/input/day${day}.txt`, 'utf8')
    .split('\n')
    .filter(r => !!r)

export const isNumeric = n => parseFloat(n).toString() === n

const parseValue = value => isNumeric(value) ? parseFloat(value) : value

export const replaceAll = (str, search, replacement) =>
  str.replace(new RegExp(search, 'g'), replacement)

const replaceRules = [
  ['%i', '[\\s]*(-?\\d+)'],
  ['%w', '[\\s]*(\\w+)']
]

export const parseByPattern = rawPattern => {
  const pattern = replaceRules.reduce(
    (p, [from, to]) => replaceAll(p, from, to),
    rawPattern,
  )
  const regex = new RegExp(pattern)

  return value => regex.exec(value).slice(1).map(parseValue)
}

export const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')

export const arrayCounts = array => {
  const counts = {}

  array.forEach(value => {
    counts[value] = (counts[value] || 0) + 1
  })

  return counts
}

export const emptyArray = (length, getValue = (key: number) => 0) =>
  Array.from({ length }, (_, key) => getValue(key))

export const filterMap = (func, values) =>
  values.map(func).filter(value => value !== undefined)

export const findFactors = num =>
  range(1, Math.floor(Math.sqrt(num)))
    .filter(n => num % n === 0)
    .reduce((acc, n) => [...acc, n, num / n], [])

export const findIndices = (func, values) =>
  filterMap((item, index) => func(item, index) ? index : undefined, values)

export const indicesOf = (search, values) =>
  filterMap((value, index) => value === search ? index : undefined, values)

export const intersection = (values, compare) =>
  values.filter(v => compare.includes(v))

export const maxBy = (accessor, values) => {
  const comparisons = values.map(accessor)
  const max = Math.max(...comparisons)

  return indicesOf(max, comparisons).map(i => values[i])
}

export const minBy = (accessor, values) => {
  const comparisons = values.map(accessor)
  const min = Math.min(...comparisons)

  return indicesOf(min, comparisons).map(i => values[i])
}

export const range = (from: number, to: number): number[] =>
  Array.from({ length: to - from }, (_, k) => k + from)

export const sum = values =>
  values.reduce((a, b) => a + b, 0)

export const unique = values =>
  Array.from(new Set(values))

export class DefaultDict {
  constructor(getDefault) {
    return new Proxy({}, {
      get: (target, name) => {
        if (!(name in target)) {
          target[name] = getDefault()
        }

        return target[name]
      },
    })
  }
}
