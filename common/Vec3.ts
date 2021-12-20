export type Vec3 = { x: number, y: number, z: number }

export const origin: Vec3 = { x: 0, y: 0, z: 0 }

type Axis = keyof Vec3
type Dir = Axis | `-${Axis}`
// type NegDir<A extends Axis> = `-${A}`

const axes = ['x', 'y', 'z'] as const

export type Rotation = [Dir, Dir, Dir]

const neg: Record<Dir, Dir> = { x: '-x', y: '-y', z: '-z', '-x': 'x', '-y': 'y', '-z': 'z' }

const rotations2 = ([a, b, c]: Rotation): Rotation[] => [
  [a, b, c],
  [a, neg[b], neg[c]],
  [a, c, neg[b]],
  [a, neg[c], b],
]

export const rotations: Rotation[] = [
  // ['x', 'y', 'z'],
  // ['-x', '-y', '-z'],
  // ['y', 'z', 'x'],
  // ['-y', '-z', '-x'],
  // ['z', 'x', 'y'],
  // ['-z', '-x', '-y'],
  ['x', 'y', 'z'],
  ['-x', 'y', '-z'],
  ['y', 'z', 'x'],
  ['-y', 'z', '-x'],
  ['z', 'x', 'y'],
  ['-z', 'x', '-y'],
].flatMap(rotations2)

const rotateAxis = (dir: Dir, v: Vec3): number =>
  axes.includes(dir as Axis) ? v[dir] : -rotateAxis(dir.slice(1) as Dir, v)

export const rotate = ([xDir, yDir, zDir]: Rotation, v: Vec3): Vec3 =>
  ({ x: rotateAxis(xDir, v), y: rotateAxis(yDir, v), z: rotateAxis(zDir, v) })

// const allRotations = (v: Vec3): Vec3[] =>
//   rotations.map()

export const fromString = (s: string): Vec3 => fromTuple(s.split(',').map(Number))

export const fromTuple = ([x, y, z]: number[]): Vec3 => ({ x, y, z })

export const manhattan = (a: Vec3, b: Vec3): number =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z)

export const toString = ({ x, y, z }: Vec3): string => `${x},${y},${z}`

export const equal = (a: Vec3, b: Vec3): boolean =>
  a.x === b.x && a.y === b.y && a.z === b.z

export const add = (a: Vec3, b: Vec3): Vec3 =>
  ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z })

export const subtract = (a: Vec3, b: Vec3): Vec3 =>
  ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z })

