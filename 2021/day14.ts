import { Counts, List } from '../common'

type Rule = [string, string]

const getInput = (rows: string[]) => {
  const [[template], rawRules] = List.splitBy('', rows)

  const rules = rawRules
    .map(r => r.split(' -> '))
    .flatMap(([pair, insert]): Rule[] => [[pair, pair[0] + insert], [pair, insert + pair[1]]])

  return { template, rules }
}

const step = (rules: Rule[]) => (counts: Counts): Counts =>
  Counts.fromEntries(rules.map(([from, to]) => [to, counts.get(from)]))

const createPairs = (polymer: string): string[] =>
  List.zipPairs(polymer.split('')).map(pair => pair.join(''))

const charCounts = (pairCounts: Counts): Counts =>
  Counts.fromEntries(pairCounts.entries().map(([pair, count]): [string, number] => [pair[1], count]))

const solve = (rules: Rule[], template: string, stepCount: number) => {
  const initialCounts = new Counts(List.counts(createPairs(template)))
  const pairCounts = List.range(0, stepCount).reduce(step(rules), initialCounts)

  const counts = charCounts(pairCounts)
  counts.add(template[0], 1) // First character

  return counts.max() - counts.min()
}

export default (rows: string[]) => {
  const { rules, template } = getInput(rows)

  const result1 = solve(rules, template, 10)
  const result2 = solve(rules, template, 40)

  return [result1, result2, 2345, 2432786807053]
}
