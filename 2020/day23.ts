import { List } from '../common'

class CycleList {
  dict: Record<number, number>

  constructor(values: number[]) {
    const last = values[values.length - 1]

    this.dict = Object.fromEntries(List.zipPairs(values))
    this.dict[last] = values[0]
  }

  addAfter(after: number, values: number[]) {
    const later = this.dict[after]

    let value = after
    for (const next of values) {
      this.dict[value] = next
      value = next
    }

    this.dict[value] = later
  }

  pickAfter(after: number, count: number): number[] {
    const picked = []
    let value = after
    for (let i = 0; i < count; i++) {
      value = this.dict[value]
      picked.push(value)
    }
    this.dict[after] = this.dict[value]
    return picked
  }
}

const moveTimes = (cups: number[], times: number): Record<number, number> => {
  const max = cups.length

  const dict: Record<number, number> = Object.fromEntries(List.zipPairs(cups))
  dict[cups[cups.length - 1]] = cups[0]

  let time = 0
  let current = cups[0]
  while (time < times) {
    const pickup = [
      dict[current],
      dict[dict[current]],
      dict[dict[dict[current]]],
    ]
    const destValue = [
      current - 1,
      current - 2,
      current - 3,
      current - 4,
      max,
      max - 1,
      max - 2,
      max - 3,
    ].filter(n => n > 0 && !pickup.includes(n))[0]

    dict[current] = dict[pickup[2]]
    dict[pickup[2]] = dict[destValue]
    dict[destValue] = pickup[0]
    current = dict[current]

    time += 1
  }

  return dict
}

const getResult1 = (dict: Record<number, number>): number => {
  const length = 9
  const result = []
  let n = 1
  for (let i = 0; i < length; i++) {
    result.push(n)
    n = dict[n]
  }

  return parseInt(result.slice(1).join(''))
}

export default ([row]: string[]) => {
  const input = row.split('').map(n => parseInt(n))

  const million = List.range(1, 1_000_000 + 1)
  input.forEach((v, i) => {
    million[i] = v
  })

  const end2 = moveTimes(million, 10_000_000)

  const result1 = getResult1(moveTimes(input, 100))
  const result2 = end2[1] * end2[end2[1]]

  return [result1, result2, 49576328, 511780369955]
}
