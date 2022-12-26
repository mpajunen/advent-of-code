import { Grid, List, Vec2 } from '../common'
import { Dir } from '../common/Vec2'

type Cell = '#' | '.'

const getInput = (rows: string[]) =>
  new Grid(rows.map(r => r.split('') as Cell[]))

// Clockwise from north
const units = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]].map(Vec2.fromTuple)
const dirIndices = { N: 0, S: 4, W: 6, E: 2 }

const priorities: Dir[] = ['N', 'S', 'W', 'E']

type Move = { from: Vec2, to: Vec2 }

const getElfMove = (grid: Grid<Cell>, round: number, position: Vec2): Move | undefined => {
  const adjacent = units.map(a => Vec2.add(position, a)).map(p => grid.get(p))

  if (!adjacent.includes('#')) {
    return undefined
  }

  const getDirPositions = (dir: Dir) => [-1, 0, 1]
    .map(offset => (dirIndices[dir] + offset + units.length) % units.length)
    .map(i => adjacent[i])
  const dirHasElf = (dir: Dir) => getDirPositions(dir).includes('#')
  const getDirMove = (dir: Dir): Move | undefined =>
    dirHasElf(dir) ? undefined : { from: position, to: Vec2.add(position, Vec2.units[dir]) }

  return List.range(0, priorities.length)
    .map(index => priorities[(round + index) % priorities.length])
    .reduce(
      (move, dir) => move ?? getDirMove(dir),
      undefined as Move | undefined,
    )
}

const getElfMoves = (grid: Grid<Cell>, round: number): Move[] => {
  const all = grid.valuePlaces('#').flatMap<Move>(p => getElfMove(grid, round, p) ?? [])

  return Object.values(List.groupBy(move => Vec2.toString(move.to), all))
    .flatMap(group => group.length === 1 ? group : [])
}

const makeMoves = (grid: Grid<Cell>, moves: Move[]) =>
  moves.forEach(move => {
    grid.set(move.from, '.')
    grid.set(move.to, '#')
  })

const processRounds = (grid: Grid<Cell>, roundCount: number) => {
  List.range(0, roundCount).forEach(round => {
    const moves = getElfMoves(grid, round)

    makeMoves(grid, moves)
  })

  return grid
}

const processRoundsUntilStop = (grid: Grid<Cell>) => {
  let round = 0

  while (true) {
    const moves = getElfMoves(grid, round)
    if (moves.length === 0) {
      return round + 1
    }

    makeMoves(grid, moves)
    round += 1
  }
}

const getLimits = (grid: Grid<Cell>) => {
  const elfPositions = grid.valuePlaces('#')

  const allX = elfPositions.map(p => p.x)
  const allY = elfPositions.map(p => p.y)

  return {
    elfCount: elfPositions.length,
    min: { x: Math.min(...allX), y: Math.min(...allY) },
    max: { x: Math.max(...allX), y: Math.max(...allY) },
  }
}

const getRegionSize = (grid: Grid<Cell>) => {
  const { elfCount, min, max } = getLimits(grid)

  return (max.x - min.x + 1) * (max.y - min.y + 1) - elfCount
}

const createLargeGrid = (base: Grid<Cell>) =>
  Grid.create(
    Vec2.add(base.size(), { x: 200, y: 200 }),
    p => base.get({ x: p.x - 100, y: p.y - 100 }) ?? '.',
  )

export default (rows: string[]) => {
  const grid = createLargeGrid(getInput(rows))

  const result1 = getRegionSize(processRounds(grid.copy(), 10))
  const result2 = processRoundsUntilStop(grid.copy())

  return [result1, result2, 3800, 916]
}
