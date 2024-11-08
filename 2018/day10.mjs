import { Grid, Input } from '../common'

const readInput = rows => {
  const parse = Input.parseByPattern('position=<%i,%i> velocity=<%i,%i>')

  const getPoint = row => {
    const [px, py, vx, vy] = parse(row)

    return {
      position: { x: px, y: py },
      velocity: { x: vx, y: vy },
    }
  }

  const points = rows.map(getPoint)

  return { points }
}

const atTime = time => point => ({
  x: point.position.x + point.velocity.x * time,
  y: point.position.y + point.velocity.y * time,
})

const getBoxSide = (positions, key) => {
  const values = positions.map(p => p[key])

  return Math.max(...values) - Math.min(...values)
}

const getBoxSize = positions =>
  getBoxSide(positions, 'x') * getBoxSide(positions, 'y')

const findMinTime = points => {
  let time = 0
  let minSize = 99999999999

  while (true) {
    const positions = points.map(atTime(time))
    const boxSize = getBoxSize(positions)

    if (boxSize > minSize) {
      return time - 1
    } else {
      minSize = boxSize
    }

    time += 1
  }
}

const createPositionGrid = (points, time) => {
  const positions = points.map(atTime(time))

  const g = Grid.create(200, () => '.')

  positions.forEach(p => {
    g.set(p, '#')
  })

  return g
}

export default rows => {
  const { points } = readInput(rows)

  const result2 = findMinTime(points)

  createPositionGrid(points, result2).stringGrid()
  const result1 = 'FBHKLEAG'

  return [result1, result2, 'FBHKLEAG', 10009]
}
