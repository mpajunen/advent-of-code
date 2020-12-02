import * as common from '../common/common'
import { unique } from '../common/common'
import * as Vec2 from '../common/Vec2'

const getAngle = (from: Vec2.Vec2) => (to: Vec2.Vec2): number =>
  Vec2.angle(Vec2.subtract(to, from))

const getAngleCounts = (positions: Vec2.Vec2[]) => (from: Vec2.Vec2) =>
  unique(positions.map(getAngle(from))).length - 1 // Remove self

const getLaserRotation = (angle: number): number =>
  (angle >= -90 ? angle : angle + 360) + 90

export default function day10(rows: string[]): [unknown, unknown] {
  const positions = rows.flatMap(
    (row, y) => common.chunk(1, row).flatMap(
      (char, x) => char === '#' ? [{ x, y } as Vec2.Vec2] : [],
    ),
  )
  const [best] = common.maxBy(getAngleCounts(positions), positions)
  const maxCount = getAngleCounts(positions)(best)

  const info = positions
    .map(position => ({
      position,
      angle: getAngle(best)(position),
      distance: Vec2.manhattan(best, position),
    }))
    .filter(i => i.distance > 0)

  const groups = Object.values(common.groupBy(i => i.angle, info))
  const closest = groups.map(group => common.minBy(i => i.distance, group)[0])

  const vaporized = common.sortBy(i => getLaserRotation(i.angle), closest)
  const betWinner = vaporized[200 - 1]

  return [
    maxCount, // 303
    betWinner.position.x * 100 + betWinner.position.y, // 408
  ]
}
