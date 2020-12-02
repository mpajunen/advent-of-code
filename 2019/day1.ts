import * as common from '../common/common'

const getBaseFuel = (mass: number) => Math.trunc(mass / 3) - 2

const getFuel = (mass: number) => {
  const next = getBaseFuel(mass)

  return next <= 0 ? 0 : next + getFuel(next)
}

export default function day1(rows: string[]): [unknown, unknown] {
  const masses = rows.map(row => parseInt(row))

  const result1 = common.sum(masses.map(getBaseFuel))
  const result2 = common.sum(masses.map(getFuel))

  return [
    result1, // 3337766
    result2, // 5003788
  ]
}
