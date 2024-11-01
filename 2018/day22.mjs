import * as common from './common'
import { createGrid } from './Grid'

const INDEX_X = 16807
const INDEX_Y = 48271

const input = {
  depth: 3558,
  target: [15, 740],
}

const createTypes = maxPlace => {
  const erosion = createGrid(() => 0, maxPlace[0] + 1, maxPlace[1] + 1)

  const getIndex = ([x, y]) => {
    if (x === 0 && y === 0) {
      return 0
    } else if (x === input.target[0] && y === input.target[1]) {
      return 0
    } else if (y === 0) {
      return x * INDEX_X
    } else if (x === 0) {
      return y * INDEX_Y
    } else {
      return erosion.get([x - 1, y]) * erosion.get([x, y - 1])
    }
  }

  erosion.mapMutate((_, place) => {
    return (getIndex(place) + input.depth) % 20183
  })

  return erosion.map(e => e % 3)
}

const types = createTypes(input.target)

const result1 = common.sum(types.values())

console.log(result1) // 11810

const MARGIN = 30

const SWITCH_COST = 7

const MAX_COST = 9999999

const LIMITS = [input.target[0] + MARGIN, input.target[1] + MARGIN]

const TOOLS = ['gear', 'neither', 'torch']

const PROHIBITED = ['neither', 'torch', 'gear']

const overTypes = createTypes(LIMITS)

const createCost = () => ({
  gear: MAX_COST,
  neither: MAX_COST,
  torch: MAX_COST,
})

const tryMove = (costs, frontier, from, to) => {
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
          .map(([t, c]) => c + SWITCH_COST),
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

const getAdjacent = ([x, y]) => [
  [x, y - 1],
  [x, y + 1],
  [x - 1, y],
  [x + 1, y],
]

const movePlace = (costs, frontier, place) =>
  getAdjacent(place).forEach(t => tryMove(costs, frontier, place, t))

const createCosts = () => {
  const costs = overTypes.map(createCost)
  costs.set([0, 0], {
    gear: SWITCH_COST,
    neither: MAX_COST,
    torch: 0,
  })
  const frontier = [[0, 0]]

  let i = 0
  while (i < frontier.length) {
    const place = frontier[i]

    movePlace(costs, frontier, place)
    i++
  }

  return costs
}

const costs = createCosts()

const result2 = costs.get(input.target).torch

console.log(result2) // 1015
