import { Input, List } from '../common'
import * as Cube from './Cube'

const readInput = rows => {
  const parse = Input.parseByPattern('pos=<%i,%i,%i>, r=%i')

  return rows.map(parse).map(([x, y, z, radius]) => ({
    position: [x, y, z],
    radius,
  }))
}

const getInRadius = (bots, bot) =>
  bots.filter(p => Cube.manhattan(p.position)(bot.position) <= bot.radius)

const reachesBox = (center, boxRadius) => bot =>
  Cube.manhattan(bot.position)(center) <= bot.radius + (boxRadius - 1)

const reachCount = (bots, radius) => position =>
  bots.filter(reachesBox(position, radius)).length

const findMaxOfPositions = (bots, radius, positions) => {
  const haveMost = List.maxBy(reachCount(bots, radius), positions)
  const [closest] = List.minBy(m => Cube.length(m), haveMost)

  return closest
}

// This won't necessarily work in a general case
const findClosestMax = (bots, center = Cube.ORIGIN, radius = 2 ** 30) => {
  if (radius < 1) {
    return center
  }

  const positions = new Cube.Box(center, radius).unitCombos
  const closest = findMaxOfPositions(bots, radius, positions)

  return findClosestMax(bots, closest, radius / 2)
}

export default rows => {
  const bots = readInput(rows)

  const strongest = List.maxBy(p => p.radius, bots)[0]

  const result1 = getInRadius(bots, strongest).length
  const result2 = Cube.length(findClosestMax(bots))

  return [result1, result2, 442, 100985898]
}
