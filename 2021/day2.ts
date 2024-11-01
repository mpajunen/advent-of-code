import produce from 'immer'
import { Input } from '../common'

const getInput = (rows: string[]) =>
  rows.map(Input.parseByPattern<Command>('%w %i'))

const start = { depth: 0, aim: 0, horizontal: 0 }

type Sub = typeof start
type Command = ['up' | 'down' | 'forward', number]

const change1 = produce((sub: Sub, [direction, value]: Command) => {
  switch (direction) {
    case 'forward':
      sub.horizontal += value
      break
    case 'down':
      sub.depth += value
      break
    case 'up':
      sub.depth -= value
      break
  }
})

const change2 = produce((sub: Sub, [direction, value]: Command) => {
  switch (direction) {
    case 'forward':
      sub.horizontal += value
      sub.depth += sub.aim * value
      break
    case 'down':
      sub.aim += value
      break
    case 'up':
      sub.aim -= value
      break
  }
})

export default (rows: string[]) => {
  const input = getInput(rows)

  const sub1 = input.reduce(change1, start)
  const sub2 = input.reduce(change2, start)

  const result1 = sub1.depth * sub1.horizontal
  const result2 = sub2.depth * sub2.horizontal

  return [result1, result2, 2091984, 2086261056]
}
