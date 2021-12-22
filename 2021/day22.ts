import { Input, Num, Vec3 } from '../common'

const parse = Input.parseByPattern('%w x=%i..%i,y=%i..%i,z=%i..%i')

type Cuboid = [Vec3, Vec3]
type Step = { to: 'on' | 'off', area: Cuboid }

const getInput = (rows: string[]) =>
  rows.map(parse).map(([to, ...limits]) => {
    const [x1, x2, y1, y2, z1, z2] = limits as number[]
    const area = [[x1, y1, z1], [x2, y2, z2]].map(Vec3.fromTuple)

    return { to, area } as Step
  })

type Slice = [number, number]
type Intersection = { axis: keyof Vec3, outside: Slice[], inside: Slice[] }

const nonEmptySlice = ([min, max]: Slice) => min <= max

const axisIntersections = (a: Cuboid, b: Cuboid, axis: keyof Vec3): Intersection => {
  const [aMin, aMax, bMin, bMax] = [...a, ...b].map(v => v[axis])

  const before: Slice = [aMin, Math.min(aMax, bMin - 1)]
  const after: Slice = [Math.max(aMin, bMax + 1), aMax]

  const inside: Slice = [Math.max(aMin, bMin), Math.min(aMax, bMax)]

  return { axis, outside: [before, after].filter(nonEmptySlice), inside: [inside].filter(nonEmptySlice) }
}

const allAxisIntersections = (a: Cuboid, b: Cuboid) =>
  Vec3.axes.map(axis => axisIntersections(a, b, axis))

const splitSlice = ([min, max]: Cuboid, [sliceMin, sliceMax]: Slice, axis: keyof Vec3): Cuboid => [
  { ...min, [axis]: sliceMin },
  { ...max, [axis]: sliceMax },
]

const split = (cuboid: Cuboid, intersection: Intersection): [Cuboid[], Cuboid[]] => {
  const { axis } = intersection
  const outside = intersection.outside.map(slice => splitSlice(cuboid, slice, axis))
  const remaining = intersection.inside.map(slice => splitSlice(cuboid, slice, axis))

  return [outside, remaining]
}

// Parts of a that are not in b
const subtract = (a: Cuboid, b: Cuboid): Cuboid[] => {
  const intersections = allAxisIntersections(a, b)

  // a doesn't intersect b:
  if (intersections.some(s => s.inside.length === 0)) {
    return [a]
  }

  const intersection = intersections.find(i => i.outside.length > 0)
  // a entirely inside b:
  if (!intersection) {
    return []
  }

  const [outside, remaining] = split(a, intersection)

  return [...outside, ...remaining.flatMap(c => subtract(c, b))]
}

const subtractMany = (a: Cuboid, cuboids: Cuboid[]): Cuboid[] =>
  cuboids.reduce((remaining, cuboid) => remaining.flatMap(r => subtract(r, cuboid)), [a])

type State = { on: Cuboid[], off: Cuboid[] }

const addStep = (state: State, step: Step): State => {
  const outsideLater = subtractMany(step.area, [...state.off, ...state.on])

  return { ...state, [step.to]: [...state[step.to], ...outsideLater] }
}

const initialState: State = { on: [], off: [] }

const solve = (steps: Step[]): State => steps.reverse().reduce(addStep, initialState)

const size = ([min, max]: Cuboid) =>
  Num.product(Vec3.axes.map(axis => max[axis] - min[axis] + 1))

const totalSize = (cuboids: Cuboid[]) => Num.sum(cuboids.map(size))

const limits = [[-50, -50, -50], [50, 50, 50]].map(Vec3.fromTuple) as Cuboid

const withinLimits = (cuboids: Cuboid[]) =>
  size(limits) - totalSize(subtractMany(limits, cuboids))

export default (rows: string[]) => {
  const input = getInput(rows)

  const solved = solve(input)

  const result1 = withinLimits(solved.on)
  const result2 = totalSize(solved.on)

  return [result1, result2, 547648, 1206644425246111]
}
