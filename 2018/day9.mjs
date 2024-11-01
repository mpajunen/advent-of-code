import * as common from './common'
import CycleList from './CycleList'

const readInput = () => {
  const [row] = common.readDayRows(9)
  const parse = common.parseByPattern(
    '%i players; last marble is worth %i points',
  )

  const [playerCount, lastMarble] = parse(row)

  return { playerCount, lastMarble }
}

const { playerCount, lastMarble } = readInput()

const SPECIAL_TRIGGER = 23
const SPECIAL_MOVEMENT = 7

const placeMarbles = (players, finalMarble) => {
  const scores = []
  let marble = 0

  const cycle = new CycleList([marble])

  while (marble < finalMarble) {
    marble += 1

    if (marble % SPECIAL_TRIGGER === 0) {
      cycle.backward(SPECIAL_MOVEMENT)

      const player = marble % players
      scores[player] = (scores[player] || 0) + marble + cycle.head.value

      cycle.remove()
    } else {
      cycle.forward()
      cycle.add(marble)
    }
  }

  return { cycle, scores }
}

const highScore = scores => Math.max(...Object.values(scores))

const placements1 = placeMarbles(playerCount, lastMarble)
const result1 = highScore(placements1.scores)

console.log(result1) // 408679

const MULTIPLIER = 100

const placements2 = placeMarbles(playerCount, lastMarble * MULTIPLIER)
const result2 = highScore(placements2.scores) // 3443939356

console.log(result2)
