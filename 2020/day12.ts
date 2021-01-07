import { Grid, Input, Num, List, Str, Vec2 } from '../common'

type Act = Vec2.Dir | Vec2.TurnDir | 'F'
type Ship = { position: Vec2.Vec2, facing: Vec2.Dir }
type Action = { action: Act, value: number }
type WithWaypoint = { position: Vec2.Vec2, waypoint: Vec2.Vec2 }

type Reducer<S, A> = (state: S, action: A) => S

const turnTimes = (value: Vec2.Dir, dir: Vec2.TurnDir, times: number): Vec2.Dir =>
  times === 0 ? value : turnTimes(Vec2.turns[dir][value], dir, times - 1)

const rotateTimes = (value: Vec2.Vec2, dir: Vec2.TurnDir, times: number): Vec2.Vec2 =>
  times === 0 ? value : rotateTimes(Vec2.rotateDir(value, dir), dir, times - 1)

const act1: Reducer<Ship, Action> = (ship, { action, value }) => {
  const { facing, position } = ship
  switch (action) {
    case 'N':
    case 'S':
    case 'E':
    case 'W':
      return { facing, position: Vec2.move(position, { dir: action, length: value }) }
    case 'L':
    case 'R':
      return { facing: turnTimes(facing, action, value / 90), position }
    case 'F':
      return { facing, position: Vec2.move(position, { dir: facing, length: value }) }
  }
}

const act2: Reducer<WithWaypoint, Action> = (state, { action, value }) => {
  const { position, waypoint } = state

  switch (action) {
    case 'N':
    case 'S':
    case 'E':
    case 'W':
      return { position, waypoint: Vec2.move(waypoint, { dir: action, length: value }) }
    case 'L':
    case 'R':
      return { position, waypoint: rotateTimes(waypoint, action, value / 90) }
    case 'F':
      return { position: Vec2.add(position, Vec2.mul(waypoint, value)), waypoint }
  }
}

export default (rows: string[]) => {
  const moves: Action[] = rows.map(r => ({ action: r[0] as Act, value: parseInt(r.slice(1)) }))

  const ship1: Ship = { position: Vec2.origin, facing: 'E' }
  const state: WithWaypoint = { position: Vec2.origin, waypoint: { x: 10, y: -1 } }

  const end1 = moves.reduce(act1, ship1)
  const end2 = moves.reduce(act2, state)

  const result1 = Vec2.manhattan(Vec2.origin, end1.position)
  const result2 = Vec2.manhattan(Vec2.origin, end2.position)

  return [result1, result2, 882, 28885]
}
