import { Input, List, Str } from '../common'

type Move = { count: number, from: number, to: number }
type Stacks = Record<number, string>

const getInput = (rows: string[]) => {
  const [stackRows, moveRows] = List.splitBy('', rows)

  const stackNumberRow = stackRows.pop()
  const stackNumbers = stackNumberRow.trim().split('   ')
  const stackEntries = stackNumbers.map(num => {
    const index = stackNumberRow.indexOf(num)
    const crates = stackRows.map(row => row[index]).join('').trim()

    return [num, crates]
  })
  const stacks: Stacks = Object.fromEntries(stackEntries)

  const moves = moveRows
    .map(Input.parseByPattern<[number, number, number]>('move %i from %i to %i'))
    .map(([count, from, to]) => ({ count, from, to }))

  return { stacks, moves }
}

const makeMove = (moveMultiple: boolean) => (stacks: Stacks, move: Move): Stacks => {
  const [moving, from] = Str.splitAt(stacks[move.from], move.count)

  const to = (moveMultiple ? moving : Str.reverse(moving)) + stacks[move.to]

  return { ...stacks, [move.from]: from, [move.to]: to }
}

export default (rows: string[]) => {
  const { stacks, moves } = getInput(rows)

  const moved1 = moves.reduce(makeMove(false), stacks)
  const moved2 = moves.reduce(makeMove(true), stacks)

  const result1 = Object.values(moved1).map(s => s[0]).join('')
  const result2 = Object.values(moved2).map(s => s[0]).join('')

  return [result1, result2, 'CNSZFDVLJ', 'QNDWLMGNS']
}
