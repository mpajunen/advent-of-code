import { Input, Num } from '../common'
import { createGraph } from './Graph'

const parseRow = Input.parseByPattern('%i,%i,%i,%i')

const MAX = 3

const getDistance = (a, b) => Num.sum(a.map((v, i) => Math.abs(v - b[i])))

const isClose = (a, b) => getDistance(a, b) <= MAX

const getConstellationCount = points =>
  createGraph(points, isClose).getDisconnectedGroups().length

export default rows => {
  const points = rows.map(parseRow)

  const result1 = getConstellationCount(points)

  return [result1, undefined, 377, undefined]
}
