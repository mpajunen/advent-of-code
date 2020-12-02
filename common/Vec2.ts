export type Dir = 'D' | 'L' | 'R' | 'U'

export type Move = { dir: Dir, length: number }

export type Line = [Vec2, Vec2]

export type Vec2 = { x: number, y: number }


export const origin: Vec2 = { x: 0, y: 0 }

export const units: Record<Dir, Vec2> = {
  D: { x: 0, y: -1 },
  L: { x: -1, y: 0 },
  R: { x: 1, y: 0 },
  U: { x: 0, y: 1 },
}

export const add = (a: Vec2, b: Vec2): Vec2 =>
  ({ x: a.x + b.x, y: a.y + b.y })

export const angle = ({ x, y}: Vec2): number =>
  x === 0 && y === 0 ? Number.NaN : Math.atan2(y, x) / Math.PI * 180

export const manhattan = (a: Vec2, b: Vec2): number =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y)

export const move = (start: Vec2, move: Move): Vec2 => add(start, moveVec(move))

export const moveVec = ({ dir, length }: Move): Vec2 =>
  ({ x: units[dir].x * length, y: units[dir].y * length })

export const subtract = (a: Vec2, b: Vec2): Vec2 =>
  ({ x: a.x - b.x, y: a.y - b.y })
