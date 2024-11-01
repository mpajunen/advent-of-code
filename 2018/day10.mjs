import * as common from './common'
import { createGrid } from './Grid'

const readInput = () => {
  const rows = common.readDayRows(10)
  const parse = common.parseByPattern('position=<%i,%i> velocity=<%i,%i>')

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

const { points } = readInput()

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

const findMinTime = () => {
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

const createPositionGrid = time => {
  const positions = points.map(atTime(time))

  const g = createGrid(() => '.', 200)

  positions.forEach(({ x, y }) => {
    g.set([x, y], '#')
  })

  return g
}

const minTime = findMinTime()

const result1 = createPositionGrid(minTime).stringGrid()

console.log(result1) // FBHKLEAG

const result2 = minTime

console.log(result2) // 10009
