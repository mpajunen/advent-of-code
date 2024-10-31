'use strict'

const fs = require('fs')

const sum = (a, b) => a + b

const prod = (a, b) => a * b

const getBoxSides = box => box.split('x').map(side => parseInt(side, 10))

const sides = fs
  .readFileSync('input/day2.txt', 'utf8')
  .trim()
  .split('\n')
  .map(getBoxSides)

const getBoxMaterial = ([height, length, width]) => {
  const areas = [height * length, length * width, width * height]

  return 2 * areas.reduce(sum, 0) + Math.min(...areas)
}

const result1 = sides.map(getBoxMaterial).reduce(sum, 0)

console.log(result1)

const getBoxRibbon = sides => {
  const wrap = 2 * (sides.reduce(sum, 0) - Math.max(...sides))
  const ribbon = sides.reduce(prod, 1)

  return wrap + ribbon
}

const result2 = sides.map(getBoxRibbon).reduce(sum, 0)

console.log(result2)
