import { List, Num } from '../common'

const getInput = ([row]: string[]) => row.split(',').map(Number)

const step = ([spawning, ...rest]: number[]) => {
  rest[6] += spawning
  rest[8] = spawning

  return rest
}

const steps = (counts: number[], stepCount: number) => {
  for (let i = 1; i <= stepCount; i++) {
    counts = step(counts)
  }
  return counts
}

const buildCounts = (fish: number[]) => {
  const counts = List.counts(fish)

  return Array.from({ length: 9 }, (_, key) => counts[key] ?? 0) // 0 - 8 days until spawn
}

export default (rows: string[]) => {
  const input = getInput(rows)

  const result1 = Num.sum(steps(buildCounts(input), 80))
  const result2 = Num.sum(steps(buildCounts(input), 256))

  return [result1, result2, 385391, 1728611055389]
}
