import * as common from './common'
import { createGrid, manhattan } from './Grid'

const readInput = rows => {
  const coordinates = rows.map(row => row.split(', ').map(c => parseInt(c, 10)))

  return { coordinates }
}

const GRID_SIZE = 500

const findClosest = coordinates => point => {
  const distances = coordinates.map(manhattan(point))
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

const TOTAL_LIMIT = 10000

const findTotal = coordinates => point =>
  common.sum(coordinates.map(manhattan(point)))

export default rows => {
  const input = readInput(rows)

  const closestGrid = createGrid(findClosest(input.coordinates), GRID_SIZE)
  const edgeAreas = findEdgeValues(closestGrid)
  const areaSizes = closestGrid.filter(v => !edgeAreas.has(v)).valueCounts()

  const totalsGrid = createGrid(findTotal(input.coordinates), GRID_SIZE)

  const result1 = Math.max(...Object.values(areaSizes))
  const result2 = totalsGrid.values().filter(v => v <= TOTAL_LIMIT).length

  return [result1, result2, 4011, 46054]
}
