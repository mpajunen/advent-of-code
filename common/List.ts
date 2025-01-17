export const chunk = <T>(values: T[], size: number): T[][] =>
  range(0, values.length, size).map(start => values.slice(start, start + size))

export const counts = <V extends number | string>(
  array: V[],
): Record<V, number> => {
  const found: Partial<Record<V, number>> = {}

  array.forEach(value => {
    found[value] = (found[value] || 0) + 1
  })

  return found as Record<V, number>
}

export const empty = (length: number, getValue = (key: number) => 0) =>
  Array.from({ length }, (_, key) => getValue(key))

export const exclude = <T>(values: T[], exclusion: T[]): T[] =>
  values.filter(v => !exclusion.includes(v))

export const filterMap = <In, Out>(
  func: (value: In, index: number) => Out | undefined,
  values: In[],
): Out[] => values.map(func).filter(value => value !== undefined)

export const findIndices = <T>(
  func: (value: T, index: number) => number,
  values: T[],
) => filterMap((item, index) => (func(item, index) ? index : undefined), values)

export const groupBy = <T, K extends number | string>(
  getGroup: (item: T) => K,
  items: T[],
): Partial<Record<K, T[]>> => {
  const groups: Partial<Record<K, T[]>> = {}

  for (const item of items) {
    const group = getGroup(item)

    groups[group] = groups[group] || []
    groups[group].push(item)
  }

  return groups
}

export const includes = <T>(list: Readonly<T[]>, value: unknown): value is T =>
  list.includes(value as T)

export const indicesOf = <T>(search: T, values: T[]): number[] =>
  filterMap((value, index) => (value === search ? index : undefined), values)

export const intersection = <T>(values: T[], compare: T[]): T[] =>
  values.filter(v => compare.includes(v))

export const intersectionOf = <T>([first, ...rest]: T[][]): T[] =>
  rest.reduce(intersection, unique(first))

export const intersects = <T>(values: T[], compare: T[]): boolean =>
  values.some(v => compare.includes(v))

export const isSorted = <T extends number | string>(list: T[]): boolean =>
  zipPairs(list).every(([a, b]) => a <= b)

export const mapBy = <T, K extends number | string>(
  items: T[],
  accessor: (item: T) => K,
): Partial<Record<K, T>> =>
  Object.fromEntries(items.map(item => [accessor(item), item])) as Partial<
    Record<K, T>
  >

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

export const partition = <T>(
  accessor: (v: T) => boolean,
  values: T[],
): [T[], T[]] => {
  const groups = groupBy(v => (accessor(v) ? 1 : 0), values)

  return [groups[1] ?? [], groups[0] ?? []]
}

export const range = (from: number, to: number, step = 1): number[] =>
  Array.from({ length: (to - from) / step }, (_, k) => k * step + from)

export const repeat = <T>(value: T, count: number): T[] =>
  new Array(count).fill(value)

type Scanner<Accumulator, Item> = (
  value: Accumulator,
  item: Item,
) => Accumulator

export const scan = <Accumulator, Item>(
  initial: Accumulator,
  items: Item[],
  scanner: Scanner<Accumulator, Item>,
): Accumulator[] => {
  let value = initial

  return items.map(item => {
    value = scanner(value, item)

    return value
  })
}

type SequenceLength<T> = { value: T; length: number }

export const sequenceLengths = <T>(values: T[]): SequenceLength<T>[] =>
  sequences(values).map(seq => ({ value: seq[0], length: seq.length }))

export const sequences = <T>(values: T[]): T[][] => {
  const all = []

  let previous = undefined

  for (const value of values) {
    if (value !== previous) {
      all.push([])
    }
    all[all.length - 1].push(value)
    previous = value
  }

  return all
}

export const sort = <T extends number | string>(items: T[]): T[] =>
  sortBy(i => i, items)

export const sortBy = <T, K extends number | string>(
  accessor: (item: T) => K,
  items: T[],
): T[] => {
  const compare = (a: T, b: T) => {
    const ka = accessor(a)
    const kb = accessor(b)

    return ka < kb ? -1 : ka > kb ? 1 : 0
  }

  return [...items].sort(compare)
}

type Splitter<T> = T | ((value: T) => boolean)
type SplitValue = number | string | object

export const splitBy = <T extends SplitValue>(
  splitter: Splitter<T>,
  values: T[],
  includeSplit = false,
): T[][] => {
  const all: T[][] = [[]]

  const split =
    typeof splitter === 'function' ? splitter : (value: T) => value === splitter

  values.forEach(value => {
    if (split(value)) {
      all.push([])
      if (includeSplit) {
        all[all.length - 1].push(value)
      }
    } else {
      all[all.length - 1].push(value)
    }
  })

  return all
}

export const symmetricDifference = <T>(a: T[], b: T[]): T[] =>
  [exclude(a, b), exclude(b, a)].flat()

export const unique = <T>(values: T[]): T[] => Array.from(new Set(values))

export const until = <T>(values: T[], condition: (value: T) => boolean) => {
  const index = values.findIndex(condition)

  return index === -1 ? values : values.slice(0, index)
}

export const windowed = <T>(windowSize: number, values: T[]): T[][] => {
  const starts = range(0, values.length - windowSize + 1)
  const offsets = range(0, windowSize)

  return starts.map(start => offsets.map(offset => values[start + offset]))
}

export const zip = <A, B>(a: A[], b: B[]): [A, B][] =>
  a.slice(0, b.length).map((aValue, i) => [aValue, b[i]])

export const zipPairs = <T>(list: T[]): [T, T][] => zip(list, list.slice(1))
