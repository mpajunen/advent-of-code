export const LARGE_VALUE = 999999999

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

export const arrayCounts = <V extends number | string>(array: V[]): Record<V, number> => {
  const counts: Partial<Record<V, number>> = {}

  array.forEach(value => {
    counts[value] = (counts[value] || 0) + 1
  })

  return counts as Record<V, number>
}

export const digits = (n: number): number[] => {
  const least = n % 10
  const remaining = Math.floor(n / 10)

  return remaining > 0 ? [...digits(remaining), least] : [least]
}

export const charCounts = (s: string): Record<string, number> => arrayCounts(chunk(1, s))

export const emptyArray = (length, getValue = (key: number) => 0) =>
  Array.from({ length }, (_, key) => getValue(key))

export const filterMap = <In, Out>(func: (value: In, index: number) => Out | undefined, values: In[]): Out[] =>
  values.map(func).filter(value => value !== undefined)

export const findFactors = num =>
  range(1, Math.floor(Math.sqrt(num)))
    .filter(n => num % n === 0)
    .reduce((acc, n) => [...acc, n, num / n], [])

export const findIndices = <T>(func: (value: T, index: number) => number, values: T[]) =>
  filterMap((item, index) => func(item, index) ? index : undefined, values)

export const indicesOf = <T>(search: T, values: T[]): number[] =>
  filterMap((value, index) => value === search ? index : undefined, values)

export const groupBy = <T, K extends number | string>(getGroup: (item: T) => K, items: T[]): Partial<Record<K, T[]>> => {
  const groups: Partial<Record<K, T[]>> = {}

  for (const item of items) {
    const group = getGroup(item)

    groups[group] = groups[group] || []
    groups[group].push(item)
  }

  return groups
}

export const sortBy = <T, K extends number | string>(accessor: (item: T) => K, items: T[]): T[] => {
  const compare = (a: T, b: T) => {
    const ka = accessor(a)
    const kb = accessor(b)

    return ka < kb ? -1 : ka > kb ? 1 : 0
  }

  return items.sort(compare)
}

export const intersection = (values, compare) =>
  values.filter(v => compare.includes(v))

export const maxBy = <T>(accessor: (v: T) => number, values: T[]): T[] => {
  const comparisons = values.map(accessor)
  const max = Math.max(...comparisons)

  return indicesOf(max, comparisons).map(i => values[i])
}

export const minBy = <T>(accessor: (v: T) => number, values: T[]): T[] => {
  const comparisons = values.map(accessor)
  const min = Math.min(...comparisons)

  return indicesOf(min, comparisons).map(i => values[i])
}

export const findGroupMin = <T, Group extends number | string>(
  getGroup: (item: T) => Group,
  accessor: (v: T) => number,
  items: T[],
): T[] => {
  const groups = groupBy(getGroup, items)
  const groupValues: T[][] = Object.values(groups)

  return groupValues.map(group => minBy(accessor, group)[0])
}

export const range = (from: number, to: number, step = 1): number[] =>
  Array.from({ length: (to - from) / step }, (_, k) => (k * step) + from)

export const sum = (values: number[]): number =>
  values.reduce((a, b) => a + b, 0)

export const steps = <State, Mod>(step: (state: State, mod: Mod) => State, mods: Mod[], initial: State): State[] => {
  const states: State[] = [initial]

  let current: State = initial
  mods.forEach(mod => {
    current = step(current, mod)
    states.push(current)
  })

  return states
}

export const zip = <A, B>(a: A[], b: B[]): [A, B][] =>
  a.slice(0, b.length).map((aValue, i) => [aValue, b[i]])

export const zipPairs = <T>(list: T[]): [T, T][] =>
  zip(list, list.slice(1))

export const chunk = (chunkLength: number, s: string): string[] =>
  range(0, s.length, chunkLength).map(i => s.slice(i, i + chunkLength))

export const unique = <T>(values: T[]): T[] =>
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
