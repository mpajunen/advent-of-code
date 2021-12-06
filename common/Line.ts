import { add, Vec2 } from './Vec2'

export type Line = { from: Vec2, to: Vec2 }

const isHorizontal = (line: Line) => line.from.y === line.to.y
const isVertical = (line: Line) => line.from.x === line.to.x
const isAxial = (line: Line) => isHorizontal(line) || isVertical(line)

// Only works for horizontal, vertical and diagonal lines!
const points = ({ from, to }: Line): Vec2[] => {
  const step: Vec2 = {
    x: from.x === to.x ? 0 : from.x > to.x ? -1 : 1,
    y: from.y === to.y ? 0 : from.y > to.y ? -1 : 1,
  }

  const all = [from]
  let next = from
  while (next.x !== to.x || next.y !== to.y) {
    next = add(next, step)
    all.push(next)
  }

  return all
}

export const Line = {
  isHorizontal,
  isVertical,
  isAxial,
  points,
}
