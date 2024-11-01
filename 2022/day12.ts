import { Grid, Input, Num, Str, Vec2 } from '../common'

type Input = ReturnType<typeof getInput>

const getInput = (rows: string[]) => {
  const map = Grid.fromStrings(rows)

  const start = map.findPlace(cell => cell === 'S')
  const end = map.findPlace(cell => cell === 'E')

  map.set(start, 'a')
  map.set(end, 'z')

  return { map, start, end }
}

const buildReverseDistanceMap = (input: Input) => {
  const heights = input.map.map(v => Str.alphabet.indexOf(v))

  const distances = heights.map(() => Num.LARGE_VALUE)
  distances.set(input.end, 0)
  const front = [input.end]

  while (front.length > 0) {
    const from = front.pop()
    const fromHeight = heights.get(from)
    const distance = distances.get(from)

    const targets = Vec2.adjacent(from)
      // Reverse direction, step _down_ max 1 at a time:
      .filter(position => (heights.get(position) ?? -2) >= fromHeight - 1)
      .filter(position => distances.get(position) > distance + 1)

    for (const target of targets) {
      distances.set(target, distance + 1)
      front.push(target)
    }
  }

  return distances
}

export default (rows: string[]) => {
  const input = getInput(rows)

  const distanceMap = buildReverseDistanceMap(input)
  const bottomDistances = distanceMap
    .entries()
    .flatMap(([position, distance]) =>
      input.map.get(position) === 'a' ? distance : [],
    )

  const result1 = distanceMap.get(input.start)
  const result2 = Math.min(...bottomDistances.values())

  return [result1, result2, 472, 465]
}
