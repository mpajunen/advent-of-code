import { Num } from '../common'

const getBaseFuel = (mass: number) => Math.trunc(mass / 3) - 2

const getFuel = (mass: number): number => {
  const next = getBaseFuel(mass)

  return next <= 0 ? 0 : next + getFuel(next)
}

export default (rows: string[]) => {
  const masses = rows.map(row => parseInt(row))

  const result1 = Num.sum(masses.map(getBaseFuel))
  const result2 = Num.sum(masses.map(getFuel))

  return [result1, result2, 3337766, 5003788]
}
