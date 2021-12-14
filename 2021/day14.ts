import { List } from '../common'

type Counts = Record<string, number>
type Rule = [string, string[]]

const getInput = (rows: string[]) => {
  const [[template], rawRules] = List.splitBy(v => v === '', rows)

  const rules = rawRules
    .map(r => r.split(' -> '))
    .map(([pair, insert]): Rule => [pair, [pair[0] + insert, insert + pair[1]]])

  return { template, rules }
}

const step = (rules: Rule[]) => (counts: Counts): Counts => {
  const newCounts: Counts = {}

  for (const [from, allTo] of rules) {
    for (const to of allTo) {
      newCounts[to] = (newCounts[to] ?? 0) + (counts[from] ?? 0)
    }
  }

  return newCounts
}

const createPairs = (polymer: string): string[] =>
  List.zipPairs(polymer.split('')).map(pair => pair.join(''))

const charCounts = (pairCounts: Counts, template: string): Counts => {
  const counts: Counts = {}
  for (const [pair, count] of Object.entries(pairCounts)) {
    counts[pair[1]] = (counts[pair[1]] ?? 0) + count
  }
  counts[template[0]] += 1 // First character

  return counts
}

const solve = (rules: Rule[], template: string, stepCount: number) => {
  const initialCounts = List.counts(createPairs(template))
  const pairCounts = List.range(0, stepCount).reduce(step(rules), initialCounts)
  const countValues = Object.values(charCounts(pairCounts, template))

  return Math.max(...countValues) - Math.min(...countValues)
}

export default (rows: string[]) => {
  const { rules, template } = getInput(rows)

  const result1 = solve(rules, template, 10)
  const result2 = solve(rules, template, 40)

  return [result1, result2, 2345, 2432786807053]
}
