import { Input, List, Vec2 } from '../common'

type Limit = [number, number]
type Limits = { x: Limit; y: Limit }

const getInput = ([row]: string[]): Limits => {
  const [xMin, xMax, yMin, yMax] = Input.parseByPattern<number[]>(
    'target area: x=%i..%i, y=%i..%i',
  )(row)

  return { x: [xMin, xMax], y: [yMin, yMax] }
}

const findSolutions = (target: Limits) => (velocity: Vec2) => {
  const hitTarget = (p: Vec2) =>
    p.x >= target.x[0] &&
    p.x <= target.x[1] &&
    p.y >= target.y[0] &&
    p.y <= target.y[1]

  let position = { x: 0, y: 0 }
  let yMax = 0

  while (position.y > target.y[0]) {
    position = Vec2.add(position, velocity)
    velocity = { x: Math.max(velocity.x - 1, 0), y: velocity.y - 1 }
    yMax = Math.max(position.y, yMax)

    if (hitTarget(position)) {
      return yMax
    }
  }

  return []
}

const solve = (target: Limits) => {
  const xRange = List.range(0, target.x[1] + 1)
  const yRange = List.range(target.y[0], -target.y[0] + 1)
  const allVectors = xRange.flatMap(x => yRange.map(y => ({ x, y })))

  return allVectors.flatMap(findSolutions(target))
}

export default (rows: string[]) => {
  const limits = getInput(rows)

  const solutions = solve(limits)

  const result1 = Math.max(...solutions)
  const result2 = solutions.length

  return [result1, result2, 6903, 2351]
}
