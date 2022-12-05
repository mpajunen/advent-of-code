export type Range = [min: number, max: number]

const MIN = 0
const MAX = 1

export const contains = (a: Range, b: Range) => a[MIN] <= b[MIN] && a[MAX] >= b[MAX]
export const eitherContains = (a: Range, b: Range) => contains(a, b) || contains(b, a)

export const length = (range: Range) => range[MAX] - range[MIN] + 1

export const overlap = (a: Range, b: Range): Range | undefined => {
  const min = Math.max(a[MIN], b[MIN])
  const max = Math.min(a[MAX], b[MAX])

  return min <= max ? [min, max] : undefined
}
export const overlaps = (a: Range, b: Range): boolean => overlap(a, b) !== undefined
