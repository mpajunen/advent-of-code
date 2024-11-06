import { Num } from '../common'

const findSmallestGroups = (
  packages: number[],
  splitIn: number,
  maxSize = 1,
): number[][] => {
  const targetWeight = Num.sum(packages) / splitIn

  const findGroups = (current: number[], remaining: number[]): number[][] => {
    const weight = Num.sum(current)

    if (weight === targetWeight) {
      return [current]
    }
    if (weight > targetWeight || current.length >= maxSize) {
      return []
    }

    return remaining.flatMap((next, i) =>
      findGroups([...current, next], remaining.slice(i + 1)),
    )
  }

  const groups = findGroups([], packages)

  return groups.length > 0
    ? groups
    : findSmallestGroups(packages, splitIn, maxSize + 1)
}

// Assumes that a combination of three / four groups can be found when any
// single group is found.
const findSmallestGroupEntanglement = (packages: number[], splitTo: number) =>
  Math.min(...findSmallestGroups(packages, splitTo).map(Num.product))

export default (rows: string[]) => {
  const packages = rows.map(Number)

  const result1 = findSmallestGroupEntanglement(packages, 3)
  const result2 = findSmallestGroupEntanglement(packages, 4)

  return [result1, result2, 11846773891, 80393059]
}
