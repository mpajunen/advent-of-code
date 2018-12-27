import * as common from './common'
import { createGraph } from './Graph'

const readInput = () => {
  const rows = common.readDayRows(25)
  const parse = common.parseByPattern('%i,%i,%i,%i')

  const points = rows.map(parse)

  return { points }
}

const input = readInput()

const MAX = 3

const getDistance = (a, b) => common.sum(a.map((v, i) => Math.abs(v - b[i])))

const isClose = (a, b) => getDistance(a, b) <= MAX

const getConstellationCount = points => createGraph(points, isClose).getDisconnectedGroups().length

const result1 = getConstellationCount(input.points)

console.log(result1) // 377
