import { Grid, List, Vec2 } from '../common'

type Blizzard = '>' | '<' | '^' | 'v'
type Cell = Blizzard | '#' | '.'

const BLIZZARDS = [
  { symbol: '<', axis: 'x', dir: 1 },
  { symbol: '>', axis: 'x', dir: -1 },
  { symbol: '^', axis: 'y', dir: 1 },
  { symbol: 'v', axis: 'y', dir: -1 },
]

const hasBlizzardAtTime = (map: Grid<Cell>) => {
  const cycles = { x: map.size().x - 2, y: map.size().y - 2 }

  return (p: Vec2, time: number) =>
    BLIZZARDS.some(({ axis, dir, symbol }) => {
      const cycle = cycles[axis]
      const start = (p[axis] - 1 + dir * time % cycle + cycle) % cycle + 1

      return map.get({ ...p, [axis]: start }) === symbol
    })
}

type State = { position: Vec2, time: number }

const getUniquePositions = (all: Vec2[]): Vec2[] =>
  Object.values(List.groupBy(Vec2.toString, all)).map(p => p[0])

const findFastestPath = (map: Grid<Cell>, target: Vec2, state: State) => {
  const hasBlizzard = hasBlizzardAtTime(map)

  const isAccessible = (time: number) => (p: Vec2) =>
    map.get(p) && map.get(p) !== '#' && !hasBlizzard(p, time)

  const getNextOptions = (position: Vec2): Vec2[] =>
    [...Vec2.adjacent(position), position]

  const getAllNextPositions = (time: number, positions: Vec2[]): Vec2[] =>
    getUniquePositions(positions.flatMap(getNextOptions))
      .filter(isAccessible(time))

  let positions = [state.position]
  let time = state.time

  while (true) {
    time += 1
    positions = getAllNextPositions(time, positions)
    const position = positions.find(p => p.y === target.y)
    if (position) {
      return { position, time }
    }
  }
}

export default (rows: string[]) => {
  const map = Grid.fromStrings<Cell>(rows)

  const start = map.findPlace((cell, p) => cell === '.' && p.y === 0)
  const goal = map.findPlace((cell, p) => cell === '.' && p.y === map.size().y - 1)

  const leg1 = findFastestPath(map, goal, { position: start, time: 0 })
  const leg2 = findFastestPath(map, start, leg1)
  const leg3 = findFastestPath(map, goal, leg2)

  const result1 = leg1.time
  const result2 = leg3.time

  return [result1, result2, 274, 839]
}
