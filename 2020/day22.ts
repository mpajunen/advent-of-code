import { List, Loop, Num } from '../common'

type Decks = [number[], number[]]
type Result = [number, number[]]

const getInput = (rows: string[]) =>
  List.splitBy('', rows).map(l => l.slice(1).map(r => parseInt(r))) as Decks

const playTick = (decks: Decks, recursive: boolean): Decks => {
  const [card0, ...remaining0] = decks[0]
  const [card1, ...remaining1] = decks[1]

  const [winner] = recursive && card0 <= remaining0.length && card1 <= remaining1.length
    ? play([remaining0.slice(0, card0), remaining1.slice(0, card1)], true)
    : (card0 > card1 ? [0] : [1])

  return winner === 0
    ? [[...remaining0, card0, card1], remaining1]
    : [remaining0, [...remaining1, card1, card0]]
}

const play = (decks: Decks, recursive: boolean): Result => {
  const isEarlierState = Loop.createCheck<Decks>(decks => decks[0].join('|'))

  const findWinner = (decks: Decks): 0 | 1 | undefined =>
    decks[1].length === 0 ? 0 : decks[0].length === 0 ? 1 : undefined

  let winner
  while (winner === undefined) {
    decks = playTick(decks, recursive)
    winner = isEarlierState(decks) ? 0 : findWinner(decks)
  }

  return [winner, decks[winner]]
}

const score = ([, deck]: Result): number =>
  Num.sum([...deck].reverse().map((c, i) => c * (i + 1)))

export default (rows: string[]) => {
  const input = getInput(rows)

  const result1 = score(play(input, false))
  const result2 = score(play(input, true))

  return [result1, result2, 32629, 32519]
}
