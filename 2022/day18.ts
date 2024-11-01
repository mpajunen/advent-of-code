import { Num, Vec3 } from '../common'

const getConnectedSideCount = (cubes: Vec3[]) =>
  Num.sum(
    cubes.flatMap(a => cubes.map(b => (Vec3.manhattan(a, b) === 1 ? 1 : 0))),
  )

const getBoxLimits = (cubes: Vec3[]): [number, number] => [
  Math.min(...cubes.flatMap(c => [c.x, c.y, c.z])) - 1,
  Math.max(...cubes.flatMap(c => [c.x, c.y, c.z])) + 1,
]

const getAdjacentWithinBox = ([min, max]: [number, number], position: Vec3) =>
  Vec3.units
    .map(unit => Vec3.add(position, unit))
    .filter(p => Vec3.axes.every(axis => p[axis] >= min && p[axis] <= max))

const getInitialSearchState = (cubes: Vec3[]) => {
  const filled: Record<string, boolean> = {}
  cubes.forEach(cube => {
    filled[Vec3.toString(cube)] = true
  })
  filled[Vec3.toString({ x: 0, y: 0, z: 0 })] = false

  const search: Vec3[] = [{ x: 0, y: 0, z: 0 }]

  return { filled, search }
}

const getSurfaceArea = (cubes: Vec3[]) => {
  const { filled, search } = getInitialSearchState(cubes)
  const boxLimits = getBoxLimits(cubes)
  let surfaceArea = 0

  const processPosition = (position: Vec3) => {
    for (const adjacent of getAdjacentWithinBox(boxLimits, position)) {
      const status = filled[Vec3.toString(adjacent)]
      if (status === true) {
        surfaceArea += 1
      } else if (status === undefined) {
        filled[Vec3.toString(adjacent)] = false
        search.push(adjacent)
      }
    }
  }

  while (search.length > 0) {
    processPosition(search.pop())
  }

  return surfaceArea
}

export default (rows: string[]) => {
  const cubes = rows.map(Vec3.fromString)

  const result1 = 6 * cubes.length - getConnectedSideCount(cubes)
  const result2 = getSurfaceArea(cubes)

  return [result1, result2, 3326, 1996]
}
