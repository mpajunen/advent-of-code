import { List, Num } from '../common'

const decrypt = (numbers: number[]) => numbers.map(n => n * 811589153)

const moveIndex = (start: number[]) => (indices: number[], moveIndex: number): number[] => {
  const index = indices.indexOf(moveIndex)
  const remaining = [...indices.slice(index + 1), ...indices.slice(0, index)]

  // Determine movement based on the actual data value.
  // The moving number isn't part of the list.
  const move = start[moveIndex] % (indices.length - 1)

  return [moveIndex, ...remaining.slice(move), ...remaining.slice(0, move)]
}

const mixIndicesOnce = (start: number[]) => (indices: number[]): number[] =>
  List.range(0, start.length).reduce(moveIndex(start), indices)

const mix = (start: number[], times: number): number[] => {
  // Create a surrogate list of _the original indexes of values_ and cycle that.
  // The actual data contains duplicates.
  const indices = List.range(0, start.length)

  return List.range(0, times)
    .reduce(mixIndicesOnce(start), indices)
    .map(i => start[i])
}

const getCoordinates = (seq: number[]) =>
  [1000, 2000, 3000].map(n => seq[(seq.indexOf(0) + n) % seq.length])

export default (rows: string[]) => {
  const start = rows.map(Number)

  const result1 = Num.sum(getCoordinates(mix(start, 1)))
  const result2 = Num.sum(getCoordinates(mix(decrypt(start), 10)))

  return [result1, result2, 10707, 2488332343098]
}
