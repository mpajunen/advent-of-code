import { List, Num } from '../common'

const getInput = ([row]: string[]) => row.split(',').map(Number)

type Cost = (target: number) => (crab: number) => number

const cost1: Cost = target => crab => Math.abs(target - crab)

const cost2: Cost = target => crab => {
  const change = Math.abs(target - crab)

  return (change + 1) * change / 2
}

const minimumFuel = (crabs: number[], cost: Cost) => {
  const positions = List.range(0, 1000)

  const spent = positions.map(position => Num.sum(crabs.map(cost(position))))

  return Math.min(...spent)
}

export default (rows: string[]) => {
  const input = getInput(rows)

  const result1 = minimumFuel(input, cost1)
  const result2 = minimumFuel(input, cost2)

  return [result1, result2, 356179, 99788435]
}
