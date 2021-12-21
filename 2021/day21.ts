import { Counts, Input, List } from '../common'

const parse = Input.parseByPattern<number[]>('Player %i starting position: %i')

const getInput = (rows: string[]) => rows.map(parse).map(([, start]) => start)

type Player = { position: number, score: number }
type Game = { players: Player[], toPlay: 0 | 1 }
type Entry = [Game, number]

const BOARD_SPACES = 10

const moveSpaces = (position: number, spaces: number) =>
  (position + spaces - 1) % BOARD_SPACES + 1

const createPlayers = (positions: number[]) =>
  positions.map(position => ({ position, score: 0 }))

const playMove = (player: Player, move: number): Player => {
  const position = moveSpaces(player.position, move)
  const score = player.score + position

  return { position, score }
}

const playTurn = ({ players, toPlay }: Game, move: number): Game => ({
  players: players.map((p, i) => i === toPlay ? playMove(p, move) : p),
  toPlay: toPlay === 0 ? 1 : 0,
})

const findWinner = ({ players }: Game, limit: number) =>
  players.findIndex(p => p.score >= limit)

const playDeterministic = (game: Game) => {
  const DIE_SIZE = 100
  const WIN_SCORE = 1000

  let dieRolls = 0
  const rollDie = () => (dieRolls++) % DIE_SIZE + 1
  const rollDice = () => rollDie() + rollDie() + rollDie()

  while (findWinner(game, WIN_SCORE) === -1) {
    game = playTurn(game, rollDice())
  }

  return { players: game.players, dieRolls }
}

const DIRAC_ROLL_COUNTS = [
  [3, 1], // 111
  [4, 3], // 112 121 211
  [5, 6], // 113 131 311 122 212 221
  [6, 7],
  [7, 6],
  [8, 3],
  [9, 1],
]

const playQuantumTurn = ([game, count]: Entry): Entry[] =>
  DIRAC_ROLL_COUNTS.map(
    ([move, moveCount]) => [playTurn(game, move), count * moveCount],
  )

const combineIdenticalGames = (games: Entry[]): Entry[] =>
  Counts.fromEntries(games.map(([game, count]) => [JSON.stringify(game), count]))
    .entries()
    .map(([game, count]) => [JSON.parse(game), count])

const playQuantum = (game: Game): Counts<number> => {
  const WIN_SCORE = 21

  const winCounts = new Counts()
  let activeGames: Entry[] = [[game, 1]]

  while (activeGames.length > 0) {
    const [finished, unfinished] = List.partition(
      ([game]) => findWinner(game, WIN_SCORE) !== -1,
      activeGames.flatMap(playQuantumTurn),
    )

    finished.forEach(
      ([game, count]) => winCounts.add(findWinner(game, WIN_SCORE), count),
    )

    activeGames = combineIdenticalGames(unfinished)
  }

  return winCounts
}

export default (rows: string[]) => {
  const input = getInput(rows)
  const start: Game = { players: createPlayers(input), toPlay: 0 }

  const game1 = playDeterministic(start)
  const diracWinCounts = playQuantum(start)

  const result1 = Math.min(...game1.players.map(p => p.score)) * game1.dieRolls
  const result2 = diracWinCounts.max()

  return [result1, result2, 1004670, 492043106122795]
}
