import { Input, List, Num } from '../common'

const INPUT_CHUNK_SIZE = 18
const CHUNK_TEMPLATE = `inp w
mul x 0
add x z
mod x 26
div z %i
add x %i
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y %i
mul y x
add z y`

type Params = [1 | 26, number, number]

const getInput = (rows: string[]) =>
  List.chunk(rows, INPUT_CHUNK_SIZE)
    .map(chunk => chunk.join('\n'))
    .map(Input.parseByPattern<Params>(CHUNK_TEMPLATE))

// Calculate maximum z value at the start of each chunk, z can only be reduced by a limited factor
const getMaxStartZ = (endMaxZ: number, params: Params) =>
  params[0] * (endMaxZ + 1) - 1

const runChunk = (params: Params, z: number, input: number): number => {
  let x = (z % 26) + params[1]
  z = Math.trunc(z / params[0])
  if (x !== input) {
    z = z * 26 + input + params[2]
  }

  return z
}

const DIGIT_OPTIONS = List.range(1, 10)

type States = Map<number, number>

const runChunkStates = (
  params: Params,
  states: States,
  kind: 'max' | 'min',
  endMaxZ: number,
): States => {
  const newStates: Map<number, number> = new Map()
  const compare = kind === 'max' ? Math.max : Math.min
  const baseValue = kind === 'max' ? 0 : Num.LARGE_VALUE

  for (const [zBefore, digits] of states.entries()) {
    const base = digits * 10
    for (const digit of DIGIT_OPTIONS) {
      const zAfter = runChunk(params, zBefore, digit)
      if (zAfter > endMaxZ) {
        continue
      }

      newStates.set(
        zAfter,
        compare(newStates.get(zAfter) ?? baseValue, base + digit),
      )
    }
  }

  return newStates
}

const solve = (allParams: Params[], kind: 'max' | 'min'): number => {
  const allMaxZ = List.scan(0, [...allParams].reverse(), getMaxStartZ).reverse()

  const states = allParams.reduce(
    (states, params, index) =>
      runChunkStates(params, states, kind, allMaxZ[index + 1] ?? 0),
    new Map([[0, 0]]),
  )

  return states.get(0)
}

export default (rows: string[]) => {
  const params = getInput(rows)

  const result1 = solve(params, 'max')
  const result2 = solve(params, 'min')

  return [result1, result2, 41299994879959, 11189561113216]
}
