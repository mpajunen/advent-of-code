import * as common from '../common/common'
import { findGroupMin } from '../common/common'
import Grid, { CoordinatePair } from '../common/Grid'

const tiles = {
  wall: '#',
  passage: '.',
  keys: common.alphabet,
  doors: common.alphabet.map(letter => letter.toUpperCase()),
  entrance: '@',
} as const

// type MazeTile = typeof tiles.passage | typeof tiles.wall

type Maze = {
  grid: Grid<string>
  targets: [CoordinatePair, string][]
}

type State = {
  collected: string
  distance: number
  positions: CoordinatePair[]
  route: string
}

const OPEN = -1
const BLOCKED = -2
const TARGET = -3

type SpecialDistance = typeof OPEN | typeof BLOCKED | typeof TARGET

const buildInitial = (rows: string[]) => {
  const raw = new Grid<string>(rows.map(row => row.split('')))

  const maze = {
    grid: raw.map(v => v === tiles.entrance ? tiles.passage : v),
    targets: raw.entries().filter(([_, v]) => tiles.keys.includes(v)),
  }
  const state = {
    positions: [raw.findPlace(v => v === tiles.entrance)],
    distance: 0,
    collected: '',
    route: '',
  }

  return { maze, state }
}

const getAdjacent = ([x, y]: CoordinatePair): CoordinatePair[] =>
  [[x, y - 1], [x, y + 1], [x - 1, y], [x + 1, y]]

const getDiagonal = ([x, y]: CoordinatePair): CoordinatePair[] =>
  [[x - 1, y - 1], [x + 1, y + 1], [x - 1, y + 1], [x + 1, y - 1]]

const findDistances = (maze: Maze, state: State, position: CoordinatePair): Grid<number> => {
  const getInitial = (tile: string): SpecialDistance =>
    tile === '#' ? BLOCKED :
      tile === '.' ? OPEN :
        state.collected.includes(tile.toLowerCase()) ? OPEN :
          tiles.keys.includes(tile) ? TARGET : BLOCKED

  const distances = maze.grid.map<number>(getInitial)

  let next: CoordinatePair[] = [position]
  let distance = 0

  while (next.length > 0) {
    const current = next
    next = []

    current.forEach(p => {
      const value = distances.get(p)
      if (value >= 0 || value === BLOCKED) {
        return
      }

      distances.set(p, distance)

      if (value === OPEN) {
        next.push(...getAdjacent(p))
      }
    })

    distance += 1
  }

  return distances
}

function findOptimalOption(maze: Maze, states: State[]): State {
  const options = states.flatMap(findNextOptions(maze))
  if (options.length === 0) {
    return states[0]
  }

  const optimalOptions = findGroupMin(o => o.collected, o => o.distance, options)
// console.log(options.length, optimalOptions.length)
//   console.log(optimalOptions)
  return findOptimalOption(maze, optimalOptions)
}

const findNextOptions = (maze: Maze) => (state: State): State[] => {
  const allDistances = state.positions.map(p => findDistances(maze, state, p))

  return allDistances.flatMap((distances, robotIndex) =>
    common.filterMap(([position, key]) => {
      const distance = distances.get(position)
      if (state.collected.includes(key) || distance < 0) {
        return undefined
      }

      const positions = [...state.positions]
      positions[robotIndex] = position

      return {
        collected: `${state.collected.split('').sort().join('')}${key}`,
        positions,
        distance: state.distance + distance,
        route: `${state.route}${key}`,
      }
    }, maze.targets)
  )
}

const buildModified = (maze: Maze, state: State) => {
  const grid = maze.grid.copy()
  getAdjacent(state.positions[0]).forEach(p => grid.set(p, tiles.wall))

  const positions = getDiagonal(state.positions[0])

  return {
    maze: { ...maze, grid },
    state: { ...state, positions },
  }
}

export default function day18(rows: string[]): [unknown, unknown] {
  const { maze, state } = buildInitial(rows)
  const modified = buildModified(maze, state)

  return [
    // findOptimalOption(maze, [state]).distance, // 6098
    0,
    findOptimalOption(modified.maze, [modified.state]).distance, // 1818 too high
  ]
}
