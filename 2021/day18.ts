type Pair = [Value, Value]
type Value = number | Pair

const getInput = (rows: string[]): Pair[] => rows.map(row => JSON.parse(row))

type Increase = [number, 'left' | 'right']

const increasePair = ([left, right]: Pair, [amount, dir]: Increase): Pair =>
  dir === 'left'
    ? [increase(left, [amount, dir]), right]
    : [left, increase(right, [amount, dir])]

const increase = (value: Value, [amount, dir]: Increase): Value =>
  typeof value === 'number' ? value + amount : increasePair(value, [amount, dir])

type Explosion = { value: Value, addLeft?: number, addRight?: number }

const tryExplodePair = ([left, right]: Pair, depth: number): Explosion | undefined => {
  if (depth > 4) {
    return { value: 0, addLeft: left as number, addRight: right as number }
  }

  const leftRes = tryExplodePart(left, depth + 1)
  if (leftRes) {
    const { value, addLeft, addRight } = leftRes

    return { value: [value, addRight ? increase(right, [addRight, 'left']) : right], addLeft }
  }

  const rightRes = tryExplodePart(right, depth + 1)
  if (rightRes) {
    const { value, addLeft, addRight } = rightRes

    return { value: [addLeft ? increase(left, [addLeft, 'right']) : left, value], addRight }
  }

  return undefined
}

const tryExplodePart = (value: Value, depth): Explosion | undefined =>
  typeof value === 'number' ? undefined : tryExplodePair(value, depth)

const tryExplode = (a: Pair) => tryExplodePair(a, 1)?.value as Pair | undefined

const trySplit = (value: Value): Pair | undefined => {
  if (typeof value === 'number') {
    return value < 10 ? undefined : [Math.floor(value / 2), Math.ceil(value / 2)]
  }
  const [left, right] = value
  const newLeft = trySplit(left)
  if (newLeft) {
    return [newLeft, right]
  }

  const newRight = trySplit(right)
  if (newRight) {
    return [left, newRight]
  }

  return undefined
}

const reduce = (pair: Pair): Pair => {
  const changed = tryExplode(pair) ?? trySplit(pair)

  return changed ? reduce(changed) : pair
}

const add = (a: Pair, b: Pair): Pair => reduce([a, b])

const addAll = ([first, ...rest]: Pair[]): Pair => rest.reduce(add, first)

const magnitude = (v: Value): number =>
  typeof v === 'number' ? v : 3 * magnitude(v[0]) + 2 * magnitude(v[1])

const maxMagnitude = (pairs: Pair[]): number =>
  Math.max(...pairs.flatMap(a => pairs.map(b => magnitude(add(a, b)))))

export default (rows: string[]) => {
  const input = getInput(rows)

  const result1 = magnitude(addAll(input))
  const result2 = maxMagnitude(input)

  return [result1, result2, 4365, 4490]
}
