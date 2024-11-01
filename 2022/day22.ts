import { Grid, List, Vec2 } from '../common'
import { Dir, TurnDir } from '../common/Vec2'

const splitPath = (section: string, letter: string) =>
  section
    .split(letter)
    .flatMap((part, index) => (index === 0 ? part : [letter, part]))

const getPath = (row: string) =>
  splitPath(row, 'R')
    .flatMap(part => splitPath(part, 'L'))
    .map(step => (step === 'R' || step === 'L' ? step : Number(step)))

type Tile = '.' | '#' | ' '
type Map = Grid<Tile>
type Step = ReturnType<typeof getPath>[number]

const getInput = (rows: string[]) => {
  const [map, [path]] = List.splitBy('', rows)

  return { map: Grid.fromStrings<Tile>(map), path: getPath(path) }
}

type Position = Vec2 & { facing: Dir }

type Wrap = (p: Position) => Position

const createFlatWrap = (map: Map): Wrap => {
  const firstPosition = (line: string[]) =>
    Math.min(line.indexOf('.'), line.indexOf('#'))
  const lastPosition = (line: string[]) =>
    Math.max(line.lastIndexOf('.'), line.lastIndexOf('#'))

  const wrapAround = ({ x, y, facing }: Position): Partial<Vec2> => {
    switch (facing) {
      case 'N':
        return { y: lastPosition(map.column(x)) }
      case 'S':
        return { y: firstPosition(map.column(x)) }
      case 'E':
        return { x: firstPosition(map.row(y)) }
      case 'W':
        return { x: lastPosition(map.row(y)) }
    }
  }

  return p => ({ ...p, ...wrapAround(p) })
}

const sideGrid = (data: string) => Grid.fromStrings(data.trim().split('\n'))

const exampleSides = sideGrid(`
--1-
234-
--56
`)
const exampleCubeWraps = {
  1: { E: [6, 'E'], S: [4, 'N'], W: [3, 'N'], N: [2, 'N'] },
  2: { E: [3, 'W'], S: [5, 'S'], W: [6, 'S'], N: [1, 'N'] },
  3: { E: [4, 'W'], S: [5, 'W'], W: [2, 'E'], N: [1, 'W'] },
  4: { E: [6, 'N'], S: [5, 'N'], W: [3, 'E'], N: [1, 'S'] },
  5: { E: [6, 'W'], S: [2, 'S'], W: [3, 'S'], N: [4, 'S'] },
  6: { E: [1, 'E'], S: [2, 'W'], W: [5, 'E'], N: [4, 'E'] },
} as const

const actualSides = sideGrid(`
-12
-3-
45-
6--
`)
const actualCubeWraps = {
  1: { E: [2, 'W'], S: [3, 'N'], W: [4, 'W'], N: [6, 'W'] },
  2: { E: [5, 'E'], S: [3, 'E'], W: [1, 'E'], N: [6, 'S'] },
  3: { E: [2, 'S'], S: [5, 'N'], W: [4, 'N'], N: [1, 'S'] },
  4: { E: [5, 'W'], S: [6, 'N'], W: [1, 'W'], N: [3, 'W'] },
  5: { E: [2, 'E'], S: [6, 'E'], W: [4, 'E'], N: [3, 'N'] },
  6: { E: [5, 'S'], S: [2, 'N'], W: [1, 'N'], N: [4, 'S'] },
} as const

const directions = ['N', 'E', 'S', 'W'] as const

type SideKey = 1 | 2 | 3 | 4 | 5 | 6

const createCubeWrap = (map: Map, example: boolean): Wrap => {
  const sides = example ? exampleSides : actualSides
  const wraps = example ? exampleCubeWraps : actualCubeWraps

  const tilesPerSide = map.size().x / sides.size().x

  const getSideInfo = (p: Position) => {
    const position = {
      x: Math.floor(p.x / tilesPerSide),
      y: Math.floor(p.y / tilesPerSide),
    }
    const number = parseInt(sides.get(position)) as SideKey
    const tileOffset = Vec2.mul(position, tilesPerSide)
    const inTile = Vec2.subtract(p, tileOffset)

    return { position, number, tileOffset, inTile }
  }

  const maxTile = tilesPerSide - 1

  const getWithinTile = (inTile: Vec2, fromFacing: Dir, enterFacing: Dir) => {
    let x
    let y
    if (enterFacing === 'N') {
      x = {
        N: inTile.x,
        S: maxTile - inTile.x,
        E: inTile.y,
        W: maxTile - inTile.y,
      }[fromFacing]
      y = maxTile
    }
    if (enterFacing === 'S') {
      x = {
        N: maxTile - inTile.x,
        S: inTile.x,
        E: maxTile - inTile.y,
        W: inTile.y,
      }[fromFacing]
      y = 0
    }
    if (enterFacing === 'W') {
      x = maxTile
      y = {
        N: maxTile - inTile.x,
        S: inTile.x,
        E: maxTile - inTile.y,
        W: inTile.y,
      }[fromFacing]
    }
    if (enterFacing === 'E') {
      x = 0
      y = {
        N: inTile.x,
        S: maxTile - inTile.x,
        E: inTile.y,
        W: maxTile - inTile.y,
      }[fromFacing]
    }

    return { x, y }
  }

  return position => {
    const sideFrom = getSideInfo(position)
    const [nextSideNumber, enterFrom] = wraps[sideFrom.number][position.facing]

    const enterFacing = directions[(directions.indexOf(enterFrom) + 2 + 4) % 4]

    const withinTile = getWithinTile(
      sideFrom.inTile,
      position.facing,
      enterFacing,
    )
    const tileOrigin = Vec2.mul(
      sides.findPlace(cell => cell === nextSideNumber.toString()),
      tilesPerSide,
    )

    const newPlace = Vec2.add(tileOrigin, withinTile)

    return { ...newPlace, facing: enterFacing }
  }
}

const followPath = (
  map: Map,
  path: Step[],
  initialPosition: Position,
  wrap: Wrap,
): Position => {
  const moveOneStep = (p: Position): Position => {
    let position = { ...p, ...Vec2.add(p, Vec2.units[p.facing]) }
    let tile = map.get(position)

    if (!tile || tile === ' ') {
      position = wrap(p)
      tile = map.get(position)
    }

    return tile === '.' ? position : p
  }

  const move = (p: Position, tileCount: number): Position =>
    List.range(0, tileCount).reduce(moveOneStep, p)

  const turn = (p: Position, dir: TurnDir): Position => ({
    ...p,
    facing: Vec2.turns[dir][p.facing],
  })

  const follow = (p: Position, step: Step): Position =>
    step === 'R' || step === 'L' ? turn(p, step) : move(p, step)

  return path.reduce(follow, initialPosition)
}

const getInitialPosition = (map: Map): Position => ({
  x: map.row(0).indexOf('.'),
  y: 0,
  facing: 'E',
})

const facingScore = { E: 0, S: 1, W: 2, N: 3 }

const score = ({ x, y, facing }: Position) =>
  1000 * (y + 1) + 4 * (x + 1) + facingScore[facing]

export default (rows: string[]) => {
  const { map, path } = getInput(rows)

  const initial = getInitialPosition(map)
  const example = map.size().y < 20

  const result1 = score(followPath(map, path, initial, createFlatWrap(map)))
  const result2 = score(
    followPath(map, path, initial, createCubeWrap(map, example)),
  )

  return [result1, result2, 89224, 136182]
}
