import * as common from './common'
import { createGrid } from './Grid'

const readInput = () => {
  const rows = common.readDayRows(3)
  const parse = common.parseByPattern('#%i @ %i,%i: %ix%i')

  const claims = rows.map(parse).map(([number, x, y, width, height] ) => ({
    number,
    start: [x, y],
    end: [x + width, y + height],
    size: { height, width },
  }))

  return { claims }
}

const { claims } = readInput()


const EMPTY = -2
const OVERLAP = -1
const GRID_SIZE = 1000

const emptyGrid = () =>
  createGrid(() => EMPTY, GRID_SIZE)

const addClaim = (current, claim) => {
  const { start, end } = claim

  return current.mapPart(
    value => value !== EMPTY ? OVERLAP : claim.number,
    start,
    end,
  )
}

const grid = claims.reduce(addClaim, emptyGrid())

const counts = grid.valueCounts()

const result1 = counts[OVERLAP]

console.log(result1) // 120419


const untouched = claims.find(c => counts[c.number] === c.size.height * c.size.width)

const result2 = untouched.number

console.log(result2) // 445
