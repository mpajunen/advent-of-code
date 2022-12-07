import { List } from '../common'

const findMarker = (chars: string[], length: number) =>
  List.windowed(length, chars).findIndex(window => List.unique(window).length === length) + length

export default ([row]: string[]) => {
  const chars = row.split('')

  const result1 = findMarker(chars, 4)
  const result2 = findMarker(chars, 14)

  return [result1, result2, 1578, 2178]
}
