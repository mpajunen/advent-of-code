'use strict'

const fs = require('fs')

const input = fs.readFileSync('input/day6.txt', 'utf8').trim()

const splitAction = action => action.split(' ').slice(-4)
const convertLoc1 = location => location.split(',').map(x => parseInt(x, 10))
const convertLoc2 = ([x, y]) => {
  return { x, y }
}
const convertLoc = location => convertLoc2(convertLoc1(location))
const convertAction = ([action, startLoc, _, endLoc]) => {
  const start = convertLoc(startLoc)
  const end = convertLoc(endLoc)

  return {
    action,
    start,
    end,
  }
}
const actions = input.split('\n').map(splitAction).map(convertAction)

const applyAction = appliers => (previous, action) => appliers[action](previous)
const isInArea = (i, j) => (start, end) =>
  i >= start.x && i <= end.x && j >= start.y && j <= end.y
const applyActionMaybe =
  appliers =>
  checkArea =>
  (previous, { action, start, end }) =>
    checkArea(start, end) ? applyAction(appliers)(previous, action) : previous
const reduceLocation = (appliers, initial) => (i, j) =>
  actions.reduce(applyActionMaybe(appliers)(isInArea(i, j)), initial)

const SIZE = 1000
const loop = callback => {
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      callback(i, j)
    }
  }
}

const appliers1 = {
  off: () => false,
  on: () => true,
  toggle: prev => !prev,
}
const isLocationLit = reduceLocation(appliers1, false)

let result1 = 0

loop((i, j) => {
  if (isLocationLit(i, j)) {
    result1++
  }
})
console.log(result1)

const appliers2 = {
  off: prev => (prev === 0 ? 0 : prev - 1),
  on: prev => prev + 1,
  toggle: prev => prev + 2,
}
const getLocationBrightness = reduceLocation(appliers2, 0)
let result2 = 0

loop((i, j) => {
  result2 += getLocationBrightness(i, j)
})
console.log(result2)
