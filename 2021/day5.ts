import { Input, Line, List, Vec2 } from '../common'

const parse = Input.parseByPattern<[number, number, number, number]>('%i,%i -> %i,%i')

const getInput = (rows: string[]) => rows.map(parse).map(([x1, y1, x2, y2]) => ({
  from: { x: x1, y: y1 },
  to: { x: x2, y: y2 },
}))

const pointString = ({ x, y }: Vec2.Vec2): string => [x, y].join(',')

const intersectCount = (lines: Line[]): number => {
  const allPoints = lines.flatMap(Line.points)
  const pointCounts = List.counts(allPoints.map(pointString))

  return Object.values(pointCounts).filter(v => v > 1).length
}

export default (rows: string[]) => {
  const input = getInput(rows)

  const result1 = intersectCount(input.filter(Line.isAxial))
  const result2 = intersectCount(input)

  return [result1, result2, 6666, 19081]
}
