import { Grid, List, Str, Vec2 } from '../common'

const tiles = {
  wall: '#',
  passage: '.',
  keys: Str.alphabet.split(''),
  doors: Str.alphabet.toUpperCase().split(''),
  entrance: '@',
} as const

// type MazeTile = typeof tiles.passage | typeof tiles.wall

type Maze = {
  grid: Grid<string>
  targets: [Vec2, string][]
}

type State = {
  collected: string
  distance: number
  positions: Vec2[]
  route: string
}

const OPEN = -1
const BLOCKED = -2
const TARGET = -3

type SpecialDistance = typeof OPEN | typeof BLOCKED | typeof TARGET

const buildInitial = (rows: string[]) => {
  const raw = Grid.fromStrings<string>(rows)

  const maze = {
    grid: raw.map(v => (v === tiles.entrance ? tiles.passage : v)),
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

const findDistances = (
  maze: Maze,
  state: State,
  position: Vec2,
): Grid<number> => {
  const getInitial = (tile: string): SpecialDistance =>
    tile === '#'
      ? BLOCKED
      : tile === '.'
        ? OPEN
        : state.collected.includes(tile.toLowerCase())
          ? OPEN
          : tiles.keys.includes(tile)
            ? TARGET
            : BLOCKED

  const distances = maze.grid.map<number>(getInitial)

  let next: Vec2[] = [position]
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
        next.push(...Vec2.adjacent(p))
      }
    })

    distance += 1
  }

  return distances
}

const findGroupMin = <T, Group extends number | string>(
  getGroup: (item: T) => Group,
  accessor: (v: T) => number,
  items: T[],
): T[] => {
  const groups = List.groupBy(getGroup, items)
  const groupValues: T[][] = Object.values(groups)

  return groupValues.map(group => List.minBy(accessor, group)[0])
}

function findOptimalOption(maze: Maze, states: State[]): State {
  const options = states.flatMap(findNextOptions(maze))
  if (options.length === 0) {
    return states[0]
  }

  const optimalOptions = findGroupMin(
    o => o.collected,
    o => o.distance,
    options,
  )

  return findOptimalOption(maze, optimalOptions)
}

const findNextOptions =
  (maze: Maze) =>
  (state: State): State[] => {
    const allDistances = state.positions.map(p => findDistances(maze, state, p))

    return allDistances.flatMap((distances, robotIndex) =>
      List.filterMap(([position, key]) => {
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
      }, maze.targets),
    )
  }

const buildModified = (maze: Maze, state: State) => {
  const grid = maze.grid.copy()
  Vec2.adjacent(state.positions[0]).forEach(p => grid.set(p, tiles.wall))

  const positions = Vec2.diagonal(state.positions[0])

  return {
    maze: { ...maze, grid },
    state: { ...state, positions },
  }
}

export default (rows: string[]) => {
  const { maze, state } = buildInitial(rows)
  const modified = buildModified(maze, state)

  return [
    // findOptimalOption(maze, [state]).distance, // 6098
    0,
    findOptimalOption(modified.maze, [modified.state]).distance, // 1818 too high
  ]
}
