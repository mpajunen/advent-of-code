import { Input, Num } from '../common'
import { createGraph } from './Graph'

const readInput = rows => {
  const parse = Input.parseByPattern('%i,%i,%i,%i')

  const points = rows.map(parse)

  return { points }
}

const MAX = 3

const getDistance = (a, b) => Num.sum(a.map((v, i) => Math.abs(v - b[i])))

const isClose = (a, b) => getDistance(a, b) <= MAX

const getConstellationCount = points =>
  createGraph(points, isClose).getDisconnectedGroups().length

export default rows => {
  const input = readInput(rows)

  const result1 = getConstellationCount(input.points)

  return [result1, undefined, 377, undefined]
}
