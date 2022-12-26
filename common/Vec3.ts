export type Vec3 = { x: number, y: number, z: number }

export const origin: Vec3 = { x: 0, y: 0, z: 0 }

type Axis = keyof Vec3
type Dir = Axis | `-${Axis}`

export const axes = ['x', 'y', 'z'] as const

type Rotation = [Dir, Dir, Dir]

const negateDir: Record<Dir, Dir> = { x: '-x', y: '-y', z: '-z', '-x': 'x', '-y': 'y', '-z': 'z' }

const facingRotations = ([a, b, c]: Rotation): Rotation[] => [
  [a, b, c],
  [a, negateDir[b], negateDir[c]],
  [a, c, negateDir[b]],
  [a, negateDir[c], b],
]

const facings: Rotation[] = [
  ['x', 'y', 'z'],
  ['-x', 'y', '-z'],
  ['y', 'z', 'x'],
  ['-y', 'z', '-x'],
  ['z', 'x', 'y'],
  ['-z', 'x', '-y'],
]

export const rotations = facings.flatMap(facingRotations)

const rotateAxis = (dir: Dir, v: Vec3): number =>
  axes.includes(dir as Axis) ? v[dir] : -rotateAxis(dir.slice(1) as Dir, v)

export const rotate = ([xDir, yDir, zDir]: Rotation, v: Vec3): Vec3 =>
  ({ x: rotateAxis(xDir, v), y: rotateAxis(yDir, v), z: rotateAxis(zDir, v) })

export const fromString = (s: string): Vec3 => fromTuple(s.split(',').map(Number))

export const fromTuple = ([x, y, z]: number[]): Vec3 => ({ x, y, z })

export const units: Vec3[] = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
].map(fromTuple)

export const manhattan = (a: Vec3, b: Vec3): number =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z)

export const toString = ({ x, y, z }: Vec3): string => `${x},${y},${z}`

export const equal = (a: Vec3, b: Vec3): boolean =>
  a.x === b.x && a.y === b.y && a.z === b.z

export const add = (a: Vec3, b: Vec3): Vec3 =>
  ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z })

export const subtract = (a: Vec3, b: Vec3): Vec3 =>
  ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z })

