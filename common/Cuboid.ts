import { product } from './Num'
import { axes, fromTuple, Vec3 } from './Vec3'

export type Cuboid = { min: Vec3; max: Vec3 }

export const fromTuples = (min: number[], max: number[]): Cuboid => ({
  min: fromTuple(min),
  max: fromTuple(max),
})

export const intersection = (a: Cuboid, b: Cuboid): Cuboid | undefined => {
  const axisLimits = axes.map(axis => axisIntersection(a, b, axis))
  if (axisLimits.some(([min, max]) => max < min)) {
    return undefined
  }
  const [x, y, z] = axisLimits

  return {
    min: { x: x[0], y: y[0], z: z[0] },
    max: { x: x[1], y: y[1], z: z[1] },
  }
}

const axisIntersection = (a: Cuboid, b: Cuboid, axis: keyof Vec3) => [
  Math.max(a.min[axis], b.min[axis]),
  Math.min(a.max[axis], b.max[axis]),
]

export const intersections = (cuboid: Cuboid, list: Cuboid[]): Cuboid[] =>
  list.flatMap(item => intersection(cuboid, item) ?? [])

export const size = ({ min, max }: Cuboid): number =>
  product(axes.map(axis => max[axis] - min[axis] + 1))
