import * as common from './common'

const readInput = () => {
  const [row] = common.readDayRows(9)
  const parse = common.parseByPattern('%i players; last marble is worth %i points')

  const [playerCount, lastMarble] = parse(row)

  return { playerCount, lastMarble }
}

const { playerCount, lastMarble } = readInput()

const SPECIAL_TRIGGER = 23
const SPECIAL_MOVEMENT = -7

const specialSteps = common.range(SPECIAL_MOVEMENT, 0)

const addAfter = (marble, prev) => {
  const next = prev.next
  const active = { marble, prev, next }

  prev.next = active
  next.prev = active

  return active
}

const remove = node => {
  const { prev, next } = node
  prev.next = next
  next.prev = prev

  return next
}

const placeMarbles = (players, finalMarble) => {
  const scores = []
  let marble = 0

  let head = { marble }
  head.next = head
  head.prev = head

  while (marble < finalMarble) {
    marble += 1

    if (marble % SPECIAL_TRIGGER === 0) {
      specialSteps.forEach(() => {
        head = head.prev
      })

      const player = marble % players
      scores[player] = (scores[player] || 0) + marble + head.marble

      head = remove(head)
    } else {
      head = addAfter(marble, head.next)
    }
  }

  return { head, scores }
}

const highScore = scores => Math.max(...Object.values(scores))


const placements1 = placeMarbles(playerCount, lastMarble)
const result1 = highScore(placements1.scores)

console.log(result1) // 408679


const MULTIPLIER = 100

const placements2 = placeMarbles(playerCount, lastMarble * MULTIPLIER)
const result2 = highScore(placements2.scores) // 3443939356

console.log(result2)
