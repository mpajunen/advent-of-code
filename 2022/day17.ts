import { Grid, List, Vec2 } from '../common'

const rockPatterns = `
####

.#.
###
.#.

..#
..#
###

#
#
#
#

##
##
`
  .trim()
  .split('\n')

const rocks = List.splitBy('', rockPatterns)
  .map(rows => Grid.fromStrings(rows.reverse()))
  .map(grid =>
    grid
      .entries()
      .flatMap<Vec2>(([position, value]) => (value === '#' ? position : [])),
  )

const WIDTH = 7
const APPEAR_POSITION = { x: 2, y: 3 }

type Cell = '.' | '@'
type State = ReturnType<typeof createState>

const createState = (height: number) => ({
  grid: Grid.create<Cell>({ x: WIDTH, y: height }, () => '.'),
  time: 0,
  rockCount: 0,
  top: 0,
})

type Moved = { rock: Vec2[]; moveCount: number }

const movements = {
  '<': { x: -1, y: 0 },
  '>': { x: 1, y: 0 },
  fall: { x: 0, y: -1 },
}

const move = (rock: Vec2[], change: Vec2): Vec2[] =>
  rock.map(p => Vec2.add(p, change))

const addRock = (jets: string, state: State) => {
  const isBlocked = (rock: Vec2[]) => rock.some(p => state.grid.get(p) !== '.')

  const moveRock = (rock: Vec2[], moveCount: number = 0): Moved => {
    const time = state.time + moveCount
    const jet = jets[time % jets.length]

    const shifted = move(rock, movements[jet])
    const afterShift = isBlocked(shifted) ? rock : shifted
    const dropped = move(afterShift, movements.fall)

    return isBlocked(dropped)
      ? { rock: afterShift, moveCount: moveCount + 1 }
      : moveRock(dropped, moveCount + 1)
  }

  const initialPosition = Vec2.add(APPEAR_POSITION, { x: 0, y: state.top })
  const newRock = move(rocks[state.rockCount % rocks.length], initialPosition)
  const { rock, moveCount } = moveRock(newRock)

  rock.forEach(p => {
    state.grid.set(p, '@')
    state.top = Math.max(state.top, p.y + 1)
  })
  state.time += moveCount
  state.rockCount += 1
}

const buildTower = (jets: string, rockCount: number) => {
  const state = createState(rockCount * 2)
  const tops = [0]

  List.range(0, rockCount).forEach(() => {
    addRock(jets, state)
    tops.push(state.top)
  })

  return { ...state, tops }
}

const CYCLE_SEARCH_START = 10_000
const CYCLE_SEARCH_ROCK_COUNT = 30_000

const TOTAL_ROCKS = 1_000_000_000_000

const findCyclePeriod = (allTops: number[]) => {
  const searchTops = allTops.slice(CYCLE_SEARCH_START)

  const isPeriod = (period: number) => {
    const periodTops = searchTops.filter((_, index) => index % period === 0)
    const differences = List.zipPairs(periodTops).map(([a, b]) => b - a)

    return List.unique(differences).length === 1
  }

  return List.range(rocks.length, searchTops.length, rocks.length).find(
    isPeriod,
  )
}

const getCycleRocks = (tops: number[]) => {
  const cyclePeriod = findCyclePeriod(tops)
  const cycleHeight =
    tops[CYCLE_SEARCH_START + cyclePeriod] - tops[CYCLE_SEARCH_START]

  const completedCycles = Math.floor(
    (TOTAL_ROCKS - CYCLE_SEARCH_START) / cyclePeriod,
  )
  const rocksBeforeCycles = TOTAL_ROCKS - completedCycles * cyclePeriod

  return tops[rocksBeforeCycles] + completedCycles * cycleHeight
}

export default ([jets]: string[]) => {
  const result1 = buildTower(jets, 2022).top
  const result2 = getCycleRocks(buildTower(jets, CYCLE_SEARCH_ROCK_COUNT).tops)

  return [result1, result2, 3173, 1570930232582]
}
