import { filterMap } from './List'
import { product } from './Num'
import { axes, fromTuple, Vec3 } from './Vec3'

export type Cuboid = [Vec3, Vec3]

export const fromTuples = (min: number[], max: number[]): Cuboid =>
  [fromTuple(min), fromTuple(max)]

export const intersection = (a: Cuboid, b: Cuboid): Cuboid | undefined => {
  const axisLimits = axes.map(axis => axisIntersection(a, b, axis))
  if (axisLimits.some(([min, max]) => max < min)) {
    return undefined
  }
  const [x, y, z] = axisLimits

  return [{ x: x[0], y: y[0], z: z[0] }, { x: x[1], y: y[1], z: z[1] }]
}

const axisIntersection = (a: Cuboid, b: Cuboid, axis: keyof Vec3) => {
  const [aMin, aMax, bMin, bMax] = [...a, ...b].map(v => v[axis])

  return [Math.max(aMin, bMin), Math.min(aMax, bMax)]
}

export const intersections = (cuboid: Cuboid, list: Cuboid[]): Cuboid[] =>
  filterMap(item => intersection(cuboid, item), list)

export const size = ([min, max]: Cuboid): number =>
  product(axes.map(axis => max[axis] - min[axis] + 1))
