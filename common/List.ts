export const chunk = <T>(values: T[], size: number): T[][] =>
  range(0, values.length, size).map(start => values.slice(start, start + size))

export const counts = <V extends number | string>(array: V[]): Record<V, number> => {
  const found: Partial<Record<V, number>> = {}

  array.forEach(value => {
    found[value] = (found[value] || 0) + 1
  })

  return found as Record<V, number>
}

export const empty = (length, getValue = (key: number) => 0) =>
  Array.from({ length }, (_, key) => getValue(key))

export const exclude = <T>(values: T[], exclusion: T[]): T[] =>
  values.filter(v => !exclusion.includes(v))

export const filterMap = <In, Out>(func: (value: In, index: number) => Out | undefined, values: In[]): Out[] =>
  values.map(func).filter(value => value !== undefined)

export const findIndices = <T>(func: (value: T, index: number) => number, values: T[]) =>
  filterMap((item, index) => func(item, index) ? index : undefined, values)

export const groupBy = <T, K extends number | string>(getGroup: (item: T) => K, items: T[]): Partial<Record<K, T[]>> => {
  const groups: Partial<Record<K, T[]>> = {}

  for (const item of items) {
    const group = getGroup(item)

    groups[group] = groups[group] || []
    groups[group].push(item)
  }

  return groups
}

export const includes = <T>(list: T[], value: unknown): value is T => list.includes(value as T)

export const indicesOf = <T>(search: T, values: T[]): number[] =>
  filterMap((value, index) => value === search ? index : undefined, values)

export const intersection = <T>(values: T[], compare: T[]): T[] =>
  values.filter(v => compare.includes(v))

export const intersectionOf = <T>([first, ...rest]: T[][]): T[] =>
  rest.reduce(intersection, first)

export const isSorted = <T extends number | string>(list: T[]): boolean =>
  zipPairs(list).every(([a, b]) => a <= b)

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

export const partition = <T>(accessor: (v: T) => boolean, values: T[]): [T[], T[]] => {
  const groups = groupBy(v => accessor(v) ? 1 : 0, values)

  return [groups[1] ?? [], groups[0] ?? []]
}

export const range = (from: number, to: number, step = 1): number[] =>
  Array.from({ length: (to - from) / step }, (_, k) => (k * step) + from)

type SequenceLength<T> = { value: T, length: number }

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

export const sort = <T extends number | string>(items: T[]): T[] => sortBy(i => i, items)

export const sortBy = <T, K extends number | string>(accessor: (item: T) => K, items: T[]): T[] => {
  const compare = (a: T, b: T) => {
    const ka = accessor(a)
    const kb = accessor(b)

    return ka < kb ? -1 : ka > kb ? 1 : 0
  }

  return [...items].sort(compare)
}

export const splitBy = <T>(splitter: (value: T) => boolean, values: T[]): T[][] => {
  const all = [[]]

  values.forEach(value => {
    if (splitter(value)) {
      all.push([])
    } else {
      all[all.length - 1].push(value)
    }
  })

  return all
}

export const steps = <State, Mod>(step: (state: State, mod: Mod) => State, mods: Mod[], initial: State): State[] => {
  const states: State[] = [initial]

  let current: State = initial
  mods.forEach(mod => {
    current = step(current, mod)
    states.push(current)
  })

  return states
}

export const unique = <T>(values: T[]): T[] =>
  Array.from(new Set(values))

export const windowed = <T>(windowSize: number, values: T[]): T[][] => {
  const starts = range(0, values.length - windowSize + 1)
  const offsets = range(0, windowSize)

  return starts.map(start => offsets.map(offset => values[start + offset]))
}

export const zip = <A, B>(a: A[], b: B[]): [A, B][] =>
  a.slice(0, b.length).map((aValue, i) => [aValue, b[i]])

export const zipPairs = <T>(list: T[]): [T, T][] =>
  zip(list, list.slice(1))
