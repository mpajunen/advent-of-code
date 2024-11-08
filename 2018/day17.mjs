import { Grid, Vec2 } from '../common'
import * as common from './common'

const SPRING_AT = [500, 0]
const WIDTH = 2000

const readInput = raw => {
  const parse = common.parseByPattern('%w=%i, %w=%i..%i')

  const getBar = row => {
    const [nameA, valueA, nameB, valueB1, valueB2] = parse(row)

    return {
      [nameA]: [valueA, valueA],
      [nameB]: [valueB1, valueB2],
    }
  }

  const bars = raw.map(getBar)
  const yMin = Math.min(...bars.map(bar => Math.min(...bar.y)))
  const yMax = Math.max(...bars.map(bar => Math.max(...bar.y)))

  return { bars, yRange: [yMin, yMax] }
}

const EMPTY = '.'
const WALL = '#'
const SETTLING = '/'
const STILL = '~'
const FLOW = '|'

const createWalls = input => {
  const grid = Grid.create({ x: WIDTH, y: input.yRange[1] + 1 }, () => EMPTY)

  input.bars.forEach(({ x: [xMin, xMax], y: [yMin, yMax] }) => {
    for (let y = yMin; y <= yMax; y++) {
      for (let x = xMin; x <= xMax; x++) {
        grid.set({ x, y }, WALL)
      }
    }
  })

  return grid
}

const getPlaces = p => ({
  at: p,
  up: Vec2.add(p, Vec2.units.N),
  down: Vec2.add(p, Vec2.units.S),
  left: Vec2.add(p, Vec2.units.W),
  right: Vec2.add(p, Vec2.units.E),
})

const getValues = (grid, p) => ({
  at: grid.get(p),
  up: grid.get(Vec2.add(p, Vec2.units.N)),
  down: grid.get(Vec2.add(p, Vec2.units.S)),
  left: grid.get(Vec2.add(p, Vec2.units.W)),
  right: grid.get(Vec2.add(p, Vec2.units.E)),
})

const flow = (grid, frontier) => {
  const flowTo = place => {
    grid.set(place, FLOW)
    frontier.push(place)
  }

  const flowIf = (place, condition) => {
    if (condition) {
      flowTo(place)
    }
  }

  const checkIf = (place, condition) => {
    if (condition) {
      frontier.push(place)
    }
  }

  while (frontier.length > 0) {
    const place = frontier.pop()
    const places = getPlaces(place)
    const values = getValues(grid, place)

    if (values.down === undefined) {
    } else if (values.down === EMPTY) {
      if (getValues(grid, places.down).down !== SETTLING) {
        flowTo(places.down)
      } else {
        grid.set(places.down, FLOW)
      }
    } else if (values.down === FLOW) {
    } else if (values.left === EMPTY || values.right === EMPTY) {
      flowIf(places.left, values.left === EMPTY)
      flowIf(places.right, values.right === EMPTY)
    } else if (values.at === FLOW) {
      grid.set(place, SETTLING)
      if (values.left === WALL && values.right === WALL) {
        frontier.push(place)
      } else if (values.left === FLOW || values.right === FLOW) {
        checkIf(places.left, values.left === FLOW)
        checkIf(places.right, values.right === FLOW)
      } else {
        checkIf(places.left, values.left === SETTLING)
        checkIf(places.right, values.right === SETTLING)
      }
    } else {
      grid.set(place, STILL)
      if (values.left === SETTLING || values.right === SETTLING) {
        checkIf(places.left, values.left === SETTLING)
        checkIf(places.right, values.right === SETTLING)
      }
      checkIf(places.up, values.up === FLOW)
    }
  }
}

const flowAll = grid => {
  const [springX, springY] = SPRING_AT
  const first = { x: springX, y: springY + 1 }

  grid.set(first, FLOW)

  flow(grid, [first])

  return grid
}

const reach = (grid, tiles = [STILL, SETTLING, FLOW]) =>
  grid.values().filter(v => tiles.includes(v)).length

export default rows => {
  const input = readInput(rows)

  const situation = flowAll(createWalls(input))

  const result1 = reach(situation) - input.yRange[0] + 1
  const result2 = reach(situation, [STILL])

  return [result1, result2, 31641, 26321]
}
