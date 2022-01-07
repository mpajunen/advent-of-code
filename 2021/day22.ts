import { Input, List, Num, Vec3 } from '../common'

const parse = Input.parseByPattern('%w x=%i..%i,y=%i..%i,z=%i..%i')

type Cuboid = [Vec3, Vec3]
type Step = { to: 'on' | 'off', area: Cuboid }
type State = { on: Cuboid[], off: Cuboid[] }

const getInput = (rows: string[]) =>
  rows.map(parse).map(([to, ...limits]) => {
    const [x1, x2, y1, y2, z1, z2] = limits as number[]
    const area = [[x1, y1, z1], [x2, y2, z2]].map(Vec3.fromTuple)

    return { to, area } as Step
  })

const axisIntersection = (a: Cuboid, b: Cuboid, axis: keyof Vec3) => {
  const [aMin, aMax, bMin, bMax] = [...a, ...b].map(v => v[axis])

  return [Math.max(aMin, bMin), Math.min(aMax, bMax)]
}

const intersection = (a: Cuboid, b: Cuboid): Cuboid | undefined => {
  const axes = Vec3.axes.map(axis => axisIntersection(a, b, axis))
  if (axes.some(([min, max]) => max < min)) {
    return undefined
  }
  const [x, y, z] = axes

  return [{ x: x[0], y: y[0], z: z[0] }, { x: x[1], y: y[1], z: z[1] }]
}

const intersections = (cuboid: Cuboid, list: Cuboid[]): Cuboid[] =>
  List.filterMap(item => intersection(cuboid, item), list)

const addStep = ({ on, off }: State, { area, to }: Step): State => ({
  on: [...on, ...intersections(area, off), ...(to === 'on' ? [area] : [])],
  off: [...off, ...intersections(area, on)],
})

const solve = (steps: Step[]) => steps.reduce(addStep, { on: [], off: [] })

const size = ([min, max]: Cuboid) =>
  Num.product(Vec3.axes.map(axis => max[axis] - min[axis] + 1))
const totalSize = (cuboids: Cuboid[]) => Num.sum(cuboids.map(size))
const totalOn = (state: State) => totalSize(state.on) - totalSize(state.off)

const limits = [[-50, -50, -50], [50, 50, 50]].map(Vec3.fromTuple) as Cuboid

const withinLimits = (state: State) => ({
  on: intersections(limits, state.on),
  off: intersections(limits, state.off),
})

export default (rows: string[]) => {
  const input = getInput(rows)

  const solved = solve(input)

  const result1 = totalOn(withinLimits(solved))
  const result2 = totalOn(solved)

  return [result1, result2, 547648, 1206644425246111]
}
