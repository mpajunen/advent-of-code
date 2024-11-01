import { Cuboid, Input, Num } from '../common'

const parse = Input.parseByPattern<['on' | 'off', ...number[]]>(
  '%w x=%i..%i,y=%i..%i,z=%i..%i',
)

type Step = { to: 'on' | 'off'; area: Cuboid }
type State = { on: Cuboid[]; off: Cuboid[] }

const getInput = (rows: string[]) =>
  rows.map(parse).map(([to, ...limits]) => {
    const [x1, x2, y1, y2, z1, z2] = limits
    const area = Cuboid.fromTuples([x1, y1, z1], [x2, y2, z2])

    return { to, area }
  })

const addStep = ({ on, off }: State, { area, to }: Step): State => ({
  on: [
    ...on,
    ...Cuboid.intersections(area, off),
    ...(to === 'on' ? [area] : []),
  ],
  off: [...off, ...Cuboid.intersections(area, on)],
})

const solve = (steps: Step[]) => steps.reduce(addStep, { on: [], off: [] })

const totalSize = (cuboids: Cuboid[]) => Num.sum(cuboids.map(Cuboid.size))
const totalOn = (state: State) => totalSize(state.on) - totalSize(state.off)

const limits = Cuboid.fromTuples([-50, -50, -50], [50, 50, 50])

const withinLimits = (state: State) => ({
  on: Cuboid.intersections(limits, state.on),
  off: Cuboid.intersections(limits, state.off),
})

export default (rows: string[]) => {
  const input = getInput(rows)

  const solved = solve(input)

  const result1 = totalOn(withinLimits(solved))
  const result2 = totalOn(solved)

  return [result1, result2, 547648, 1206644425246111]
}
