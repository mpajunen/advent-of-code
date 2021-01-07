import { List, Num } from '../common'

const getGapSizes = (nums: number[]) => List.zipPairs(nums).map(([a, b]) => b - a)

const combinations = {
  1: 1,
  2: 2, // 11 02
  3: 4, // 111 021 102 003
  4: 7, // 1111 0211 1021 1102 0202 0031 1003
  5: 13, // 11111 02111(4) 02021(3) 00311(3) 00302(2) ??
}

export default (rows: string[]) => {
  const adapters = List.sort(rows.map(r => parseInt(r)))

  const builtIn = Math.max(...adapters) + 3

  const gaps = getGapSizes([0, ...adapters, builtIn])
  const counts = List.counts(gaps)

  const seqCombinations = List.sequenceLengths(gaps)
    // All gaps are 1 or 3
    .map(s => s.value === 3 ? 1 : combinations[s.length])

  const result1 = counts[1] * counts[3]
  const result2 = Num.product(seqCombinations)

  return [result1, result2, 1848, 8099130339328]
}
