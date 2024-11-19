import { Grid, List, Num, Str, Vec2 } from '../common'

type Maze = Grid<string>

const tiles = {
  wall: '#',
  passage: '.',
  keys: Str.alphabet,
  doors: Str.alphabet.toUpperCase(),
  entrance: '@',
  subEntrances: ['1', '2', '3', '4'],
}

type RawTree = {
  distance: number
  tile: string
  branches: RawTree[]
}

type Tree = {
  distance: number
  tile: string
  keys: string[]
  doors: string[]
  branches: Tree[]
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

type Segment = { keys: string[]; tile: string }
type Move = Segment & { distance: number }

const buildTree = (maze: Maze, from: string): RawTree => {
  const covered = maze.map<0 | 1>(() => 0)

  const findOptions = (position: Vec2) =>
    Vec2.adjacent(position)
      .filter(p => maze.get(p) !== tiles.wall)
      .filter(p => covered.get(p) === 0)

  const buildBranch = (position: Vec2, distance = 0): RawTree | [] => {
    covered.set(position, 1)

    const tile = maze.get(position)
    const options = findOptions(position)

    if (options.length === 0) return { distance, tile, branches: [] }

    if (tile !== tiles.passage || options.length > 1) {
      return {
        distance,
        tile,
        branches: options.flatMap(p => buildBranch(p, 1)),
      }
    }

    return buildBranch(options[0], distance + 1)
  }

  return buildBranch(maze.findPlace(v => v === from)) as RawTree
}

const shouldAlwaysVisit = (tree: Tree) =>
  tree.branches.length === 0 && tree.doors.length === 0

const pruneTree = (tree: RawTree): Tree | [] => {
  const { distance, tile } = tree

  const key = tiles.keys.includes(tile) ? tile : null
  const door = tiles.doors.includes(tile) ? tile : null

  const branches = tree.branches.flatMap(pruneTree)

  if (branches.length === 0 && !key) return []

  if (
    branches.length === 1 &&
    (tile === tiles.passage || door || shouldAlwaysVisit(branches[0]))
  ) {
    const [branch] = branches

    return {
      distance: distance + branch.distance,
      tile: branch.tile,
      keys: key ? [key, ...branch.keys] : branch.keys,
      doors: door ? [door, ...branch.doors] : branch.doors,
      branches: branch.branches,
    }
  }

  return {
    distance,
    tile,
    keys: key ? [key] : [],
    doors: door ? [door] : [],
    branches,
  }
}

const buildTrees = (maze: Maze) =>
  tiles.subEntrances.map(e => buildTree(maze, e)).flatMap(pruneTree)

const canAccess = (currentKeys: string[]) => (branch: Tree) =>
  branch.doors.every(d => currentKeys.includes(d.toLowerCase()))

const hasKeysToCollect = (currentKeys: string[]) => (segment: Segment) =>
  segment.keys.some(k => !currentKeys.includes(k))

const getTreeOptions = (currentKeys: string[], tree: Tree): Segment[] => {
  const branches = tree.branches.filter(canAccess(currentKeys))
  if (branches.length === 0) return []

  const keys = [...currentKeys, ...tree.keys]

  return [branches, branches.flatMap(b => getTreeOptions(keys, b))]
    .flat()
    .filter(hasKeysToCollect(keys))
    .map(o => ({
      keys: [...tree.keys, ...o.keys],
      tile: o.tile,
    }))
}

const getTreeRouteTo = (tile: string, tree: Tree): Tree[] => {
  if (tree.tile === tile) return [tree]
  if (tree.branches.length === 0) return []

  const route = tree.branches.flatMap(t => getTreeRouteTo(tile, t))

  return route.length > 0 ? [tree, ...route] : []
}

const getRouteTo = (trees: Tree[], tile: string) =>
  trees.flatMap(tree => getTreeRouteTo(tile, tree))

const getRouteBetween = (trees: Tree[], from: string, to: string) =>
  List.symmetricDifference(getRouteTo(trees, from), getRouteTo(trees, to))

const routeDistance = (route: Tree[]) => Num.sum(route.map(t => t.distance))

// Distance between two sub-entrances
const treeRootDistance = ([from, to]: Tree[]) =>
  Math.abs(Number(from.tile) - Number(to.tile)) % 2 === 1 ? 2 : 4

const rootDistance = (from: string, route: Tree[]) => {
  if (from === tiles.entrance) return 2 // Distance from entrance to sub-entrance

  const roots = route.filter(t => tiles.subEntrances.includes(t.tile))

  return roots.length === 2 ? treeRootDistance(roots) : 0
}

const getDistance = (trees: Tree[]) => (from: string, to: string) => {
  const route = getRouteBetween(trees, from, to)

  return routeDistance(route) + rootDistance(from, route)
}

const getAvailableMoves = (trees: Tree[], state: State, from: string) =>
  trees.flatMap(tree =>
    getTreeOptions(state.collected, tree).map(o => ({
      ...o,
      distance: getDistance(trees)(from, o.tile),
    })),
  )

const move = (s: State, from: string) => (move: Move) => ({
  collected: List.unique([...s.collected, ...move.keys]).sort(),
  distance: s.distance + move.distance,
  positions: s.positions.map(p => (p === from ? move.tile : p)),
})

const findShortestPath = (trees: Tree[], positions: string[]) => {
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

    for (const [key, position] of state.positions.entries()) {
      // With multiple robots, only look for moves in the corresponding tree:
      const robotTrees = positions.length === 1 ? trees : [trees[key]]
      const moves = getAvailableMoves(robotTrees, state, position)

      states.push(...moves.map(move(state, position)))
    }
  }

  return minDistances[tiles.keys]
}

export default (rows: string[]) => {
  const maze = Grid.fromStrings(rows)

  const trees = buildTrees(modifyMaze(maze))

  const result1 = findShortestPath(trees, [tiles.entrance])
  const result2 = findShortestPath(trees, tiles.subEntrances)

  return [result1, result2, 6098, 1698]
}
