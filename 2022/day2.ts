import { Num } from '../common'

type Pick = 0 | 1 | 2 // Rock, paper, scissors
type Result = 0 | 1 | 2 // Draw if same, win if next, loss if previous

const pickScores: Record<Pick, number> = [1, 2, 3]
const resultScores: Record<Result, number> = [3, 6, 0]

type Play = ['A' | 'B' | 'C', 'X' | 'Y' | 'Z']

const elfPicks = { A: 0, B: 1, C: 2 } as const
const pickInstruction = { X: 0, Y: 1, Z: 2 } as const
const resultInstruction = { X: 2, Y: 0, Z: 1 } as const

const result = (elf: Pick, player: Pick) => ((player - elf + 3) % 3) as Result
const resultPick = (elf: Pick, result: Result) => ((elf + result) % 3) as Pick

const score = (elf: Pick, player: Pick) =>
  resultScores[result(elf, player)] + pickScores[player]

const score1 = ([elf, player]: Play) =>
  score(elfPicks[elf], pickInstruction[player])
const score2 = ([elf, player]: Play) =>
  score(elfPicks[elf], resultPick(elfPicks[elf], resultInstruction[player]))

const getInput = (rows: string[]) => rows.map(row => row.split(' '))

export default (rows: string[]) => {
  const input = getInput(rows)

  const result1 = Num.sum(input.map(score1))
  const result2 = Num.sum(input.map(score2))

  return [result1, result2, 12645, 11756]
}
