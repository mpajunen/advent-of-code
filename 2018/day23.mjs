import * as common from './common'
import * as Cube from './Cube'

const readInput = () => {
  const rows = common.readDayRows(23)
  const parse = common.parseByPattern('pos=<%i,%i,%i>, r=%i')

  const bots = rows.map(parse).map(([x, y, z, radius]) => ({
    position: [x, y, z],
    radius,
  }))

  return { bots }
}

const { bots } = readInput()

const getInRadius = bot =>
  bots.filter(p => Cube.manhattan(p.position)(bot.position) <= bot.radius)

const strongest = common.maxBy(p => p.radius, bots)[0]

const result1 = getInRadius(strongest).length

console.log(result1) // 442

const reachesBox = (center, boxRadius) => bot =>
  Cube.manhattan(bot.position)(center) <= bot.radius + (boxRadius - 1)

const reachCount = radius => position =>
  bots.filter(reachesBox(position, radius)).length

const findMaxOfPositions = (radius, positions) => {
  const haveMost = common.maxBy(reachCount(radius), positions)
  const [closest] = common.minBy(m => Cube.length(m), haveMost)

  return closest
}

// This won't necessarily work in a general case
const findClosestMax = (center = Cube.ORIGIN, radius = 2 ** 30) => {
  if (radius < 1) {
    return center
  }

  const positions = new Cube.Box(center, radius).unitCombos
  const closest = findMaxOfPositions(radius, positions)

  return findClosestMax(closest, radius / 2)
}

const position = findClosestMax()

const result2 = Cube.length(position)

console.log(result2) // 100985898
