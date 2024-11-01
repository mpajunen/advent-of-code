import { Input, List, Num, Range, Vec2 } from '../common'

type Area = { min: Vec2; max: Vec2 }

const TEST_ROW = 2_000_000 // 10 for example data
const AREA_MAX = 4_000_000 // 20 for example data
const SEARCH_AREA = { min: { x: 0, y: 0 }, max: { x: AREA_MAX, y: AREA_MAX } }

type Sensor = ReturnType<typeof getInput>['sensors'][number]

const parse = Input.parseByPattern<[number, number, number, number]>(
  'Sensor at x=%i, y=%i: closest beacon is at x=%i, y=%i',
)

const getInput = (rows: string[]) => {
  const positions = rows.map(parse).map(([sx, sy, bx, by]) => ({
    sensor: { x: sx, y: sy },
    beacon: { x: bx, y: by },
  }))

  const sensors = positions.map(p => ({
    ...p.sensor,
    strength: Vec2.manhattan(p.sensor, p.beacon),
  }))
  const beacons = positions.map(p => p.beacon)

  return { sensors, beacons }
}

const sensorTestRowCoverage = (s: Sensor): [Range] | [] => {
  const strength = s.strength - Math.abs(s.y - TEST_ROW)

  return strength >= 0 ? [[s.x - strength, s.x + strength]] : []
}

const getTestCoverage = (sensors: Sensor[]) =>
  Range.combine(sensors.flatMap(sensorTestRowCoverage)).map(Range.length)

const getTestBeaconCount = (beacons: Vec2[]) =>
  List.unique(beacons.flatMap(b => (b.y === TEST_ROW ? b.x : []))).length

const getCorners = ({ min, max }: Area): Vec2[] => [
  min,
  max,
  { x: min.x, y: max.y },
  { x: max.x, y: min.y },
]

const splitArea = ({ min, max }: Area): Area[] => {
  const middle = {
    x: Math.trunc((max.x + min.x) / 2),
    y: Math.trunc((max.y + min.y) / 2),
  }

  return [
    { min: { x: min.x, y: min.y }, max: { x: middle.x, y: middle.y } },
    { min: { x: min.x, y: middle.y + 1 }, max: { x: middle.x, y: max.y } },
    { min: { x: middle.x + 1, y: min.y }, max: { x: max.x, y: middle.y } },
    { min: { x: middle.x + 1, y: middle.y + 1 }, max: { x: max.x, y: max.y } },
  ]
}

const sensorCoversWholeArea = (corners: Vec2[]) => (sensor: Sensor) =>
  corners.every(corner => Vec2.manhattan(sensor, corner) <= sensor.strength)

const findUncoveredPositions =
  (sensors: Sensor[]) =>
  (area: Area): Vec2[] => {
    const covered = sensors.some(sensorCoversWholeArea(getCorners(area)))
    if (covered) {
      return []
    }
    if (area.min.x === area.max.x) {
      return [area.min]
    }

    return splitArea(area).flatMap(findUncoveredPositions(sensors))
  }

export default (rows: string[]) => {
  const { sensors, beacons } = getInput(rows)

  const [distress] = findUncoveredPositions(sensors)(SEARCH_AREA)

  const result1 =
    Num.sum(getTestCoverage(sensors)) - getTestBeaconCount(beacons)
  const result2 = distress.x * 4_000_000 + distress.y

  return [result1, result2, 5511201, 11318723411840]
}
