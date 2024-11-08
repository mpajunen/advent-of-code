import { Grid } from '../common'
import * as common from './common'

const readInput = rows => {
  const parse = common.parseByPattern('#%i @ %i,%i: %ix%i')

  const claims = rows.map(parse).map(([number, x, y, width, height]) => ({
    number,
    start: { x, y },
    end: { x: x + width, y: y + height },
    size: { height, width },
  }))

  return { claims }
}

const EMPTY = -2
const OVERLAP = -1
const GRID_SIZE = 1000

const emptyGrid = () => Grid.create(GRID_SIZE, () => EMPTY)

const addClaim = (current, claim) => {
  const { start, end } = claim

  return current.mapPart(
    value => (value !== EMPTY ? OVERLAP : claim.number),
    start,
    end,
  )
}

export default rows => {
  const { claims } = readInput(rows)

  const grid = claims.reduce(addClaim, emptyGrid())

  const counts = grid.valueCounts()

  const untouched = claims.find(
    c => counts[c.number] === c.size.height * c.size.width,
  )

  const result1 = counts[OVERLAP]
  const result2 = untouched.number

  return [result1, result2, 120419, 445]
}
