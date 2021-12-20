export type Dir = 'N' | 'S' | 'E' | 'W'

export type TurnDir = 'L' | 'R'

export type Move = { dir: Dir, length: number }

export type Line = [Vec2, Vec2]

export type Vec2 = { x: number, y: number }


export const origin: Vec2 = { x: 0, y: 0 }

export const units: Record<Dir, Vec2> = {
  N: { x: 0, y: -1 },
  W: { x: -1, y: 0 },
  E: { x: 1, y: 0 },
  S: { x: 0, y: 1 },
}

const diagonalList: Vec2[] = [
  { x: -1, y: -1 },
  { x: -1, y: 1 },
  { x: 1, y: -1 },
  { x: 1, y: 1 },
]

const unitValues = Object.values(units)

export const allList = [...unitValues, ...diagonalList]

export const adjacent = (base: Vec2): Vec2[] => unitValues.map(vec => add(base, vec))

export const allAdjacent = (base: Vec2): Vec2[] => allList.map(vec => add(base, vec))

export const diagonal = (base: Vec2): Vec2[] => diagonalList.map(vec => add(base, vec))

export const add = (a: Vec2, b: Vec2): Vec2 =>
  ({ x: a.x + b.x, y: a.y + b.y })

export const angle = ({ x, y }: Vec2): number =>
  x === 0 && y === 0 ? Number.NaN : Math.atan2(y, x) / Math.PI * 180

export const equal = (a: Vec2) => (b: Vec2): boolean =>
  a.x === b.x && a.y === b.y

export const fromTuple = ([x, y]: number[]): Vec2 => ({ x, y })

export const manhattan = (a: Vec2, b: Vec2): number =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y)

export const move = (start: Vec2, move: Move): Vec2 => add(start, moveVec(move))

export const moveVec = ({ dir, length }: Move): Vec2 =>
  ({ x: units[dir].x * length, y: units[dir].y * length })

export const subtract = (a: Vec2, b: Vec2): Vec2 =>
  ({ x: a.x - b.x, y: a.y - b.y })

export const mul = ({ x, y }: Vec2, n: number): Vec2 => ({ x: x * n, y: y * n })

export const turns: Record<TurnDir, Record<Dir, Dir>> = {
  L: { N: 'W', W: 'S', S: 'E', E: 'N' },
  R: { N: 'E', W: 'N', S: 'W', E: 'S' },
}

export const rotateDir = (base: Vec2, dir: TurnDir): Vec2 =>
  dir === 'L' ? { x: base.y, y: -base.x } : { x: -base.y, y: base.x }
