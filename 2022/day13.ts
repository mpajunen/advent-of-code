import { List, Num } from '../common'

const getInput = (rows: string[]): Packet[] =>
  rows.filter(row => row !== '').map(row => JSON.parse(row)) // No pairs

type Packet = number | Packet[]

const compareLists = (left: Packet[], right: Packet[]) =>
  List.zip(left, right).reduce((prev, [left, right]) => prev || compare(left, right), 0)

const compare = (left: Packet, right: Packet): number => {
  if (typeof left === 'number' && typeof right === 'number') {
    return left - right
  }

  const leftList = typeof left === 'number' ? [left] : left
  const rightList = typeof right === 'number' ? [right] : right

  return compareLists(leftList, rightList) || leftList.length - rightList.length
}

export default (rows: string[]) => {
  const packets = getInput(rows)

  const correctIndices = List.chunk(packets, 2)
    .map(([left, right]) => compare(left, right))
    .flatMap<number>((value, index) => value < 0 ? index + 1 : [])

  const sorted = [...packets, [[2]], [[6]]].sort(compare)

  const dividerIndices = [
    sorted.findIndex(v => v[0]?.[0] === 2) + 1,
    sorted.findIndex(v => v[0]?.[0] === 6) + 1,
  ]

  const result1 = Num.sum(correctIndices)
  const result2 = Num.product(dividerIndices)

  return [result1, result2, 5208, 25792]
}
