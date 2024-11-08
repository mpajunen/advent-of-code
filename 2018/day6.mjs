import { Grid, List, Num, Vec2 } from '../common'

const readInput = rows => {
  const coordinates = rows.map(row =>
    Vec2.fromTuple(row.split(', ').map(Number)),
  )

  return { coordinates }
}

const GRID_SIZE = 500

const findClosest = coordinates => point => {
  const distances = coordinates.map(a => Vec2.manhattan(point, a))
  const minimum = Math.min(...distances)

  const indices = List.indicesOf(minimum, distances)

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
  Num.sum(coordinates.map(a => Vec2.manhattan(point, a)))

export default rows => {
  const input = readInput(rows)

  const closestGrid = Grid.create(GRID_SIZE, findClosest(input.coordinates))
  const edgeAreas = findEdgeValues(closestGrid)
  const areaSizes = closestGrid.filter(v => !edgeAreas.has(v)).valueCounts()

  const totalsGrid = Grid.create(GRID_SIZE, findTotal(input.coordinates))

  const result1 = Math.max(...Object.values(areaSizes))
  const result2 = totalsGrid.values().filter(v => v <= TOTAL_LIMIT).length

  return [result1, result2, 4011, 46054]
}
