import { List, Num } from '../common'
import {
  add,
  Line,
  manhattan,
  mul,
  origin,
  screenUnits,
  Vec2,
} from '../common/Vec2'

const getMoves = (row: string): Vec2[] =>
  row.split(',').map(move => mul(screenUnits[move[0]], parseInt(move.slice(1))))

const limit = (axis: keyof Vec2, dir: 'max' | 'min', [start, end]: Line) =>
  Math[dir](start[axis], end[axis])

const commonAxisValues = (axis: keyof Vec2, a: Line, b: Line): number[] =>
  List.range(
    Math.max(limit(axis, 'min', a), limit(axis, 'min', b)),
    Math.min(limit(axis, 'max', a), limit(axis, 'max', b)) + 1,
  )

const intersection = (a: Line, b: Line): Vec2[] => {
  const xCommon = commonAxisValues('x', a, b)
  const yCommon = commonAxisValues('y', a, b)

  return xCommon.flatMap(x => yCommon.flatMap(y => ({ x, y })))
}

const allCrossings = (a: Line[], b: Line[]) =>
  a.flatMap(al => b.flatMap(bl => intersection(al, bl)))

const lineIncludes = ([start, end]: Line, point: Vec2): boolean =>
  manhattan(start, point) + manhattan(end, point) === manhattan(start, end)

const movingDistances = (lines: Line[], crossings: Vec2[]): number[] => {
  let distance = 0

  const distances: number[] = List.empty(
    crossings.length,
    () => Num.LARGE_VALUE,
  )

  for (const [start, end] of lines) {
    crossings.forEach((crossing, index) => {
      if (lineIncludes([start, end], crossing)) {
        distances[index] = Math.min(
          distances[index],
          manhattan(start, crossing) + distance,
        )
      }
    })

    distance += manhattan(start, end)
  }

  return distances
}

export default (rows: string[]) => {
  const moves = rows.map(getMoves)
  const points = moves.map(m => [origin, ...List.scan(origin, m, add)])
  const lines = points.map(List.zipPairs)
  const crossings = allCrossings(lines[0], lines[1]).slice(1) // Remove origin
  const originDistances = crossings.map(c => manhattan(origin, c))

  const distances = lines.map(l => movingDistances(l, crossings))
  const totalDistances = List.zip(distances[0], distances[1]).map(Num.sum)

  return [Math.min(...originDistances), Math.min(...totalDistances), 266, 19242]
}
