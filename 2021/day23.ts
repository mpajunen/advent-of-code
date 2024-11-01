import { Grid, List, Num, Vec2 } from '../common'

const AMPHIPODS = ['A', 'B', 'C', 'D'] as const
const OPEN = '.'

type Amphipod = (typeof AMPHIPODS)[number]
type Open = typeof OPEN
type Occupant = Open | Amphipod
type Cell<T extends Occupant = Occupant> = [position: Vec2, occupant: T]
type Maze = Cell[]

type Move = { amphipod: Amphipod; from: Vec2; to: Vec2 }
type State = { maze: Maze; cost: number }

const HALLWAY_Y = 1
const TARGET_ROOM_X = { A: 3, B: 5, C: 7, D: 9 }
const ROOM_COLUMNS = Object.values(TARGET_ROOM_X)

const MOVE_COSTS = { A: 1, B: 10, C: 100, D: 1000 }

const getInput = (rows: string[]) => {
  const cells = Grid.fromStrings(rows).entries()

  const hallway = cells
    .filter(isOpen)
    .filter(([p]) => !ROOM_COLUMNS.includes(p.x))
  const rooms = cells.filter(isOccupied)

  return [...hallway, ...rooms] as Cell[]
}

const occupiedBy =
  (options: Readonly<Occupant[]>) =>
  ([, occupant]: Cell) =>
    List.includes(options, occupant)
const isOccupied = occupiedBy(AMPHIPODS)
const isOpen = occupiedBy([OPEN])
const hasSame = ([, occupant]: Cell) => occupiedBy([occupant])

const untilBlocked = (cells: Cell[]) => List.until(cells, isOccupied)

const between =
  (a: number, b: number) =>
  ([{ x }]: Cell) =>
    x > Math.min(a, b) && x < Math.max(a, b)

const above = (maze: Maze, [position]: Cell) =>
  maze.filter(([p]) => p.x === position.x && p.y < position.y)
const below = (maze: Maze, [position]: Cell) =>
  maze.filter(([p]) => p.x === position.x && p.y > position.y)

const hallway = (maze: Maze) => maze.filter(([p]) => p.y === HALLWAY_Y)
const hallwayBetween = (maze: Maze, [a]: Cell, [b]: Cell) =>
  hallway(maze).filter(between(a.x, b.x))
const hallwayFrom = (maze: Maze, [position]: Cell) => {
  const [left, right] = List.partition(([p]) => p.x < position.x, hallway(maze))

  return [left.reverse(), right].flatMap(untilBlocked)
}

const targetRoom = (maze: Maze, [, amphipod]: Cell): Cell[] =>
  maze.filter(([p]) => p.x === TARGET_ROOM_X[amphipod])
const inCorrectRoom = ([position, amphipod]: Cell) =>
  position.x === TARGET_ROOM_X[amphipod]

const targetsFromHallway = (maze: Maze, cell: Cell<Amphipod>): Cell[] => {
  const room = targetRoom(maze, cell)

  if (hallwayBetween(maze, cell, room[0]).some(isOccupied)) {
    return [] // Hallway to room is blocked
  }
  if (!room.filter(isOccupied).every(hasSame(cell))) {
    return [] // Different amphipod in room
  }

  return [untilBlocked(room).pop()]
}

const targetsFromRoom = (maze: Maze, cell: Cell<Amphipod>): Cell[] => {
  if (inCorrectRoom(cell) && below(maze, cell).every(hasSame(cell))) {
    return [] // No need to move
  }
  if (above(maze, cell).some(isOccupied)) {
    return [] // Can't move
  }

  return hallwayFrom(maze, cell)
}

const findAmphipodMoves =
  (maze: Maze) =>
  (cell: Cell<Amphipod>): Move[] => {
    const [from, amphipod] = cell
    const targets = from.y === HALLWAY_Y ? targetsFromHallway : targetsFromRoom

    return targets(maze, cell).map(([to]) => ({ amphipod, from, to }))
  }

const getCost = ({ amphipod, from, to }: Move) =>
  Vec2.manhattan(from, to) * MOVE_COSTS[amphipod]

const findMoves = (maze: Maze): Move[] =>
  maze.filter(isOccupied).flatMap(findAmphipodMoves(maze))

const moveAmphipod = (before: Maze, { from, to, amphipod }: Move): Maze =>
  before.map(([p, o]) => [
    p,
    Vec2.equal(p)(from) ? OPEN : Vec2.equal(p)(to) ? amphipod : o,
  ])

const applyMove =
  (state: State) =>
  (move: Move): State => ({
    maze: moveAmphipod(state.maze, move),
    cost: state.cost + getCost(move),
  })

// This fails for the initial position :)
const isSolved = ({ maze }: State) => hallway(maze).every(isOpen)

const findSolutions = (maze: Maze) => {
  const incomplete = [{ maze, cost: 0 }]

  const costs: Record<string, number> = {}
  let minSolutionCost = Num.LARGE_VALUE

  const isUnchecked = (state: State) => {
    if (state.cost >= minSolutionCost) {
      return false
    }
    const occupants = state.maze.map(([, o]) => o).join('')
    if (state.cost >= (costs[occupants] ?? Num.LARGE_VALUE)) {
      return false
    }

    costs[occupants] = state.cost
    return true
  }

  while (incomplete.length > 0) {
    const state = incomplete.pop()
    if (!isUnchecked(state)) {
      continue
    }

    const newStates = findMoves(state.maze).map(applyMove(state))

    const [newSolutions, unsolved] = List.partition(isSolved, newStates)

    minSolutionCost = Math.min(
      minSolutionCost,
      ...newSolutions.map(s => s.cost),
    )

    incomplete.push(...unsolved)
  }

  return minSolutionCost
}

const EXTRA_ROWS = ['  #D#C#B#A#', '  #D#B#A#C#']

export default (rows: string[]) => {
  const withExtraRows = [...rows.slice(0, 3), ...EXTRA_ROWS, ...rows.slice(3)]

  const result1 = findSolutions(getInput(rows))
  const result2 = findSolutions(getInput(withExtraRows))

  return [result1, result2, 10607, 59071]
}
