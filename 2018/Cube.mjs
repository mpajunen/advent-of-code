import { Num } from '../common'

export const ORIGIN = [0, 0, 0]

export const add =
  ([xa, ya, za]) =>
  ([xb, yb, zb]) => [xb + xa, yb + ya, zb + za]

const subtract = ([xa, ya, za], [xb, yb, zb]) => [xb - xa, yb - ya, zb - za]

export const multiply =
  num =>
  ([x, y, z]) => [x * num, y * num, z * num]

export const length = vec => Num.sum(vec.map(n => Math.abs(n)))

export const manhattan = a => b => length(subtract(a, b))

const UNIT_OPTIONS = [-1, 0, 1]

const buildAllDirections = () => {
  const directions = []

  UNIT_OPTIONS.forEach(x => {
    UNIT_OPTIONS.forEach(y => {
      UNIT_OPTIONS.forEach(z => {
        directions.push([x, y, z])
      })
    })
  })

  return directions
}

const DIR_ALL = buildAllDirections()

const DIR_CORNERS = DIR_ALL.filter(d => length(d) === 3)
const DIR_EDGES = DIR_ALL.filter(d => length(d) === 2)
const DIR_SIDES = DIR_ALL.filter(d => length(d) === 1)

export class Box {
  constructor(center, radius) {
    this.center = center
    this.radius = radius
  }

  get unitCombos() {
    return DIR_ALL.map(multiply(this.radius)).map(add(this.center))
  }

  get corners() {
    return DIR_CORNERS.map(multiply(this.radius)).map(add(this.center))
  }
}
