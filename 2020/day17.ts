import { Grid, List, Num, Vec2 } from '../common'

type Cell = 1 | 0
type Dimension = 1 | 2 | 3 | 4

type Key<D extends Dimension = 4> =
  D extends 4 ? 'x' | 'y' | 'z' | 'w' : D extends 3 ? 'x' | 'y' | 'z' : D extends 2 ? 'x' | 'y' : 'x'

type State<D extends Dimension = 4> =
  D extends 4 ? Cell[][][][] : D extends 3 ? Cell[][][] : D extends 2 ? Cell[][] : Cell[]

type Vec<D extends Dimension = 4> = Record<Key<D>, number>

// Near includes current cell value
const getNewValueFromNear = (value: Cell, near: number): Cell =>
  near === 3 || (near === 4 && value === 1) ? 1 : 0

type Cycle<D extends Dimension = 4> = (state: State) => State

const createCycle = <D extends Dimension>(dimension: D): Cycle<D> => state => {
  const getValue = (p: Vec): Cell => state[p.w]?.[p.z]?.[p.y]?.[p.x] ?? 0

  const getNearCount = (p: Vec): number => {
    let count = 0
    for (let w = p.w - 1; w <= p.w + 1; w++) {
      for (let z = p.z - 1; z <= p.z + 1; z++) {
        for (let y = p.y - 1; y <= p.y + 1; y++) {
          for (let x = p.x - 1; x <= p.x + 1; x++) {
            count += getValue({ x, y, z, w })
          }
        }
      }
    }
    return count
  }

  const getRange = (values: unknown[]): number[] => List.range(-1, values.length + 1)

  const ranges = [
    dimension >= 1 ? getRange(state[0][0][0]) : [0],
    dimension >= 2 ? getRange(state[0][0]) : [0],
    dimension >= 3 ? getRange(state[0]) : [0],
    dimension >= 4 ? getRange(state) : [0],
  ]

  return ranges[3].map(w => ranges[2].map(z => ranges[1].map(y => ranges[0].map(x => {
    const point = { x, y, z, w }

    return getNewValueFromNear(getValue(point), getNearCount(point))
  }))))
}

const cycleTimes = (state: State, cycle: Cycle, times: number): State =>
  times === 0 ? state : cycleTimes(cycle(state), cycle, times - 1)

type GetValue<T = unknown> = (value: T) => number

const listSum = <T>(get: GetValue<T>): GetValue<T[]> => values => Num.sum(values.map(get))

const getGetCount = <D extends Dimension>(dimension: D): GetValue<State<D>> =>
  List.range(0, dimension).reduce(sub => listSum(sub) as GetValue, (n => n) as GetValue)

export default (rows: string[]) => {
  const start = [[rows.map(r => r.split('').map(c => c === '#' ? 1 : 0))]]

  const getCount = getGetCount(4)

  const result1 = getCount(cycleTimes(start, createCycle(3), 6))
  const result2 = getCount(cycleTimes(start, createCycle(4), 6))

  return [result1, result2, 242, undefined]
}
