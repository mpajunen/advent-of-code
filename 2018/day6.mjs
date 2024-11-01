import * as common from './common'
import { createGrid, manhattan } from './Grid'

const readInput = () => {
  const rows = common.readDayRows(6)

  const coordinates = rows.map(row => row.split(', ').map(c => parseInt(c, 10)))

  return { coordinates }
}

const input = readInput()

const GRID_SIZE = 500

const findClosest = coordinates => point => {
  const distances = coordinates.map(common.manhattan(point))
  const minimum = Math.min(...distances)

  const indices = common.indicesOf(minimum, distances)

  return indices.length > 1 ? undefined : indices[0]
}

const findEdgeValues = grid =>
  new Set([
    ...grid.row(0),
    ...grid.row(-1),
    ...grid.column(0),
    ...grid.column(-1),
  ])

const closestGrid = createGrid(findClosest(input.coordinates), GRID_SIZE)

const edgeAreas = findEdgeValues(closestGrid)

const areaSizes = closestGrid.filter(v => !edgeAreas.has(v)).valueCounts()

const result1 = Math.max(...Object.values(areaSizes))

console.log(result1) // 4011

const TOTAL_LIMIT = 10000

const findTotal = coordinates => point =>
  common.sum(coordinates.map(manhattan(point)))

const totalsGrid = createGrid(findTotal(input.coordinates), GRID_SIZE)

const result2 = totalsGrid.values().filter(v => v <= TOTAL_LIMIT).length

console.log(result2) // 46054
