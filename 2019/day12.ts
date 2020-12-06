import { Input, List, Num } from '../common'

type Vec3 = { x: number, y: number, z: number }
type Moon = { id: number, position: Vec3, velocity: Vec3 }

const sum = (a: Vec3, b: Vec3): Vec3 => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z })

const magnitude = ({ x, y, z }: Vec3): number => Math.abs(x) + Math.abs(y) + Math.abs(z)

const initialVelocity: Vec3 = { x: 0, y: 0, z: 0 } as const
const axes = Object.keys(initialVelocity) as (keyof Vec3)[]

const compare = (a: number, b: number): -1 | 0 | 1 => a === b ? 0 : a < b ? -1 : 1

const getGravityUnit = (source: Vec3, target: Vec3): Vec3 =>
  ({ x: compare(source.x, target.x), y: compare(source.y, target.y), z: compare(source.z, target.z) })

const applyMoonGravity = ({ id, position, velocity }: Moon, moon: Moon): Moon => ({
  id,
  position,
  velocity: sum(velocity, getGravityUnit(moon.position, position)),
})

const applyGravity = (moons: Moon[]): Moon[] =>
  moons.map(target => moons
    .filter(moon => moon.id !== target.id)
    .reduce(applyMoonGravity, target),
  )

const applyVelocity = (moons: Moon[]): Moon[] =>
  moons.map(({ id, position, velocity }) => ({
    id,
    position: sum(position, velocity),
    velocity,
  }))

const step = (moons: Moon[]): Moon[] => applyVelocity(applyGravity(moons))
const steps = (count: number, moons: Moon[]): Moon[] =>
  List.range(0, count).reduce(step, moons)

const energy = ({ position, velocity }: Moon): number => magnitude(position) * magnitude(velocity)

const getFactors = (value: number): number[] => {
  for (const factor of List.range(2, Math.sqrt(value) + 1)) {
    if (value % factor === 0) {
      return [factor, ...getFactors(value / factor)]
    }
  }

  return [value]
}

const getFactorCounts = (value: number): Record<number, number> =>
  List.counts(getFactors(value))

const getMaxCounts = (allCounts: Record<number, number>[]): Record<number, number> => {
  const maxCounts = {}

  allCounts.forEach(counts => Object.entries(counts).map(([num, count]) => {
    maxCounts[num] = Math.max(maxCounts[num] || 0, count)
  }))

  return maxCounts
}

const factorProduct = (counts: Record<number, number>): number =>
  Object.entries(counts).reduce((value, [num, count]) => value * (parseInt(num) ** count), 1)

const leastCommonMultiple = (values: number[]): number =>
  factorProduct(getMaxCounts(values.map(getFactorCounts)))

const findAxisCycle = (initial: Moon[], axis: keyof Vec3): number => {
  let count = 0
  let current = initial

  while (true) {
    count += 1
    current = step(current)

    if (current.every(moon => moon.velocity[axis] === 0)) {
      return count * 2 // There and back again
    }
  }
}

export default function day12(rows: string[]): [unknown, unknown] {
  const moons: Moon[] = rows
    .map(Input.parseByPattern('<x=%i, y=%i, z=%i>'))
    .map(([x, y, z]) => ({ x, y, z }))
    .map((position, key) => ({ id: key, position, velocity: initialVelocity }))

  const moonsAfter = steps(1000, moons)

  const totalEnergy = Num.sum(moonsAfter.map(energy))

  const cycles = axes.map(axis => findAxisCycle(moons, axis))

  return [
    totalEnergy, // 14606
    leastCommonMultiple(cycles), // 543673227860472
  ]
}
