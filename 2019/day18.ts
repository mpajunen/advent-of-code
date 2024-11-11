import { Grid, List, Str, Vec2 } from '../common'

type Maze = Grid<string>

const tiles = {
  wall: '#',
  passage: '.',
  keys: Str.alphabet,
  doors: Str.alphabet.toUpperCase(),
  entrance: '@',
  subEntrances: ['1', '2', '3', '4'],
}

type State = {
  collected: string[]
  distance: number
  positions: string[]
}

const modifyMaze = (maze: Maze) => {
  const start = maze.findPlace(v => v === tiles.entrance)

  // Add entrances to split vaults
  Vec2.diagonal(start).forEach((p, n) => maze.set(p, String(n + 1)))

  // Add walls
  Vec2.adjacent(start).forEach(p => maze.set(p, tiles.wall))

  return maze
}

type Edge = { from: string; to: string; steps: number }
type Move = { tile: string; distance: number }

type Graph = {
  from: Record<string, Record<string, number>>
}

const findEdgesFrom =
  (maze: Maze) =>
  ([start, from]: [Vec2, string]) => {
    const find = (path: Vec2[]): Edge[] => {
      const [current] = path
      const tile = maze.get(current)
      if (tile !== tiles.passage && tile !== from) {
        return [{ from, to: tile, steps: path.length - 1 }]
      }

      const next = Vec2.adjacent(current)
        .filter(p => maze.get(p) !== tiles.wall)
        .filter(p => path.every(pp => !Vec2.equal(pp)(p)))

      return next.flatMap(p => find([p, ...path]))
    }

    return find([start])
  }

const buildGraph = (maze: Maze): Graph => {
  const allEdges = maze
    .entries()
    .filter(([_, v]) => v !== tiles.wall && v !== tiles.passage)
    .flatMap(findEdgesFrom(maze))

  const minLengths = {}
  for (const edge of allEdges) {
    minLengths[edge.from] ??= {}
    minLengths[edge.from][edge.to] = Math.min(
      minLengths[edge.from][edge.to] ?? Infinity,
      edge.steps,
    )
  }

  return { from: minLengths }
}

const isAccessible = (state: State, tile: string) =>
  !tiles.doors.includes(tile) || state.collected.includes(tile.toLowerCase())

const isTarget = (state: State, tile: string) =>
  tiles.keys.includes(tile) && !state.collected.includes(tile)

const getAvailableMoves = (
  graph: Graph,
  state: State,
  initial: string,
): Move[] => {
  const distances: Record<string, number> = { [initial]: 0 }

  const buildDistances = (from: string) => {
    for (const tile of Object.keys(graph.from[from])) {
      if (!isAccessible(state, tile)) {
        continue
      }

      const distance = distances[from] + graph.from[from][tile]
      if ((distances[tile] ?? Infinity) <= distance) {
        continue
      }

      distances[tile] = distance

      buildDistances(tile)
    }
  }

  buildDistances(initial)

  const moves = Object.entries(distances)
    .filter(([tile]) => isTarget(state, tile))
    .map(([tile, distance]) => ({ tile, distance }))

  return List.sortBy(m => m.distance, moves)
}

const move = (s: State, from: string) => (move: Move) => ({
  collected: [...s.collected, move.tile].sort(),
  distance: s.distance + move.distance,
  positions: s.positions.map(p => (p === from ? move.tile : p)),
})

const findShortestPath = (maze: Maze, positions: string[]) => {
  const graph = buildGraph(maze)
  const minDistances: Record<string, number> = {}

  const states: State[] = [{ collected: [], distance: 0, positions }]

  for (const state of states) {
    const key =
      state.collected.length === tiles.keys.length
        ? tiles.keys
        : `${state.collected.join('')}:${state.positions.join('')}`
    if (minDistances[key] && minDistances[key] <= state.distance) {
      continue
    }
    minDistances[key] = state.distance

    for (const position of state.positions) {
      const moves = getAvailableMoves(graph, state, position)

      states.push(...moves.map(move(state, position)))
    }
  }

  return minDistances[tiles.keys]
}

export default (rows: string[]) => {
  const maze = Grid.fromStrings(rows)

  const result1 = findShortestPath(maze, [tiles.entrance])
  const result2 = findShortestPath(modifyMaze(maze), tiles.subEntrances)

  return [result1, result2, 6098, 1698]
}
