import { Grid, Vec2 } from '../common'

const FLOOR = '.'
const DOOR = '+'
const WALL = '#'

const getParts = directions => {
  let i = 1
  const parts = ['']
  const stack = []
  let current = parts

  while (i < directions.length - 1) {
    let char = directions[i]

    switch (char) {
      case '(': {
        const add = ['']
        stack.push(current)
        current.push(add)
        current = add
        break
      }

      case ')':
        current = stack.pop()
        if (directions[i - 1] === '|') {
          const values = current.pop()
          current[current.length - 1] += values.join('')
        }
        break

      case '|':
        current.push('')
        break

      default: {
        const node = current[current.length - 1]
        if (Array.isArray(node)) {
          current.push(char)
        } else {
          current[current.length - 1] += char
        }
      }
    }

    i++
  }

  return parts
}

const getPlaces = (dir, pos) => [
  Vec2.add(pos, Vec2.units[dir]),
  Vec2.add(pos, Vec2.mul(Vec2.units[dir], 2)),
]

const DIRECTIONS = Object.keys(Vec2.units)

const addRoute = (maze, direction, place) => {
  const [door, corridor] = getPlaces(direction, place)

  maze.set(door, DOOR)
  maze.set(corridor, FLOOR)

  return corridor
}

const buildPart = (maze, part, place) => {
  part.split('').forEach(direction => {
    place = addRoute(maze, direction, place)
  })

  return place
}

const buildParts = (maze, parts, start) => {
  let place = start
  parts.forEach(part => {
    if (Array.isArray(part)) {
      buildParts(maze, part, place)
    } else {
      place = buildPart(maze, part, start)
    }
  })

  return place
}

const MAZE_SIZE = 320

const buildMaze = (directions, size = MAZE_SIZE) => {
  const parts = getParts(directions)
  const maze = Grid.create(size, () => WALL)
  const start = { x: size / 2, y: size / 2 }
  maze.set(start, FLOOR)

  buildParts(maze, parts, start)

  return maze
}

const findAllDepths = maze => {
  const size = maze.rows().length / 2
  const start = { x: size, y: size }
  const costs = maze.copy()
  costs.set(start, 0)
  const frontier = [start]
  let i = 0

  while (i < frontier.length) {
    const place = frontier[i]
    const cost = costs.get(place) + 1
    i++

    DIRECTIONS.forEach(direction => {
      const [door, target] = getPlaces(direction, place)

      if (costs.get(door) === DOOR && costs.get(target) === FLOOR) {
        costs.set(target, cost)
        frontier.push(target)
      }
    })
  }

  return costs.values().filter(c => Number(c) === c)
}

const findMaxDepth = maze => Math.max(...findAllDepths(maze))

const findDepthOverCount = maze =>
  findAllDepths(maze).filter(n => n >= 1000).length

export default ([input]) => {
  const maze = buildMaze(input)

  const result1 = findMaxDepth(maze)
  const result2 = findDepthOverCount(maze)

  return [result1, result2, 4184, 8596]
}
