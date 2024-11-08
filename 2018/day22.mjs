import { Grid, Vec2 } from '../common'
import * as common from './common'

const INDEX_X = 16807
const INDEX_Y = 48271

const readInput = rows => ({
  depth: Number(rows[0].match(/\d+/g)[0]),
  target: Vec2.fromString(rows[1].split(' ')[1]),
})

const createTypes = (input, maxPlace) => {
  const erosion = Grid.create({ x: maxPlace.x + 1, y: maxPlace.y + 1 }, () => 0)

  const getIndex = ({ x, y }) => {
    if (x === 0 && y === 0) {
      return 0
    } else if (x === input.target.x && y === input.target.y) {
      return 0
    } else if (y === 0) {
      return x * INDEX_X
    } else if (x === 0) {
      return y * INDEX_Y
    } else {
      return erosion.get({ x: x - 1, y }) * erosion.get({ x, y: y - 1 })
    }
  }

  erosion.mapMutate((_, place) => {
    return (getIndex(place) + input.depth) % 20183
  })

  return erosion.map(e => e % 3)
}

const MARGIN = 30

const SWITCH_COST = 7

const MAX_COST = 9999999

const TOOLS = ['gear', 'neither', 'torch']

const PROHIBITED = ['neither', 'torch', 'gear']

const createCost = () => ({
  gear: MAX_COST,
  neither: MAX_COST,
  torch: MAX_COST,
})

const tryMove = (overTypes, costs, frontier, from, to) => {
  const toType = overTypes.get(to)
  if (toType === undefined) {
    return
  }

  const fromCosts = costs.get(from)
  const toCosts = costs.get(to)

  let moved = false

  TOOLS.filter(tool => tool !== PROHIBITED[toType]).forEach(tool => {
    const cost =
      Math.min(
        fromCosts[tool],
        ...Object.entries(fromCosts)
          .filter(([t]) => t !== PROHIBITED[toType])
          .map(([_, c]) => c + SWITCH_COST),
      ) + 1

    if (cost < toCosts[tool]) {
      toCosts[tool] = cost
      moved = true
    }
  })

  if (moved) {
    frontier.push(to)
  }
}

const movePlace = (overTypes, costs, frontier, place) =>
  Vec2.adjacent(place).forEach(t =>
    tryMove(overTypes, costs, frontier, place, t),
  )

const createCosts = overTypes => {
  const costs = overTypes.map(createCost)
  costs.set(Vec2.origin, {
    gear: SWITCH_COST,
    neither: MAX_COST,
    torch: 0,
  })
  const frontier = [Vec2.origin]

  let i = 0
  while (i < frontier.length) {
    const place = frontier[i]

    movePlace(overTypes, costs, frontier, place)
    i++
  }

  return costs
}

export default rows => {
  const input = readInput(rows)

  const LIMITS = { x: input.target.x + MARGIN, y: input.target.y + MARGIN }

  const types = createTypes(input, input.target)
  const overTypes = createTypes(input, LIMITS)

  const result1 = common.sum(types.values())
  const result2 = createCosts(overTypes).get(input.target).torch

  return [result1, result2, 11810, 1015]
}
