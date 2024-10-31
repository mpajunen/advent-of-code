'use strict'

const sum = (a, b) => a + b

const prod = (a, b) => a * b

const getBoxSides = box => box.split('x').map(side => parseInt(side, 10))

const getBoxMaterial = ([height, length, width]) => {
  const areas = [height * length, length * width, width * height]

  return 2 * areas.reduce(sum, 0) + Math.min(...areas)
}

const getBoxRibbon = sides => {
  const wrap = 2 * (sides.reduce(sum, 0) - Math.max(...sides))
  const ribbon = sides.reduce(prod, 1)

  return wrap + ribbon
}

export default rows => {
  const sides = rows.map(getBoxSides)

  const result1 = sides.map(getBoxMaterial).reduce(sum, 0)

  const result2 = sides.map(getBoxRibbon).reduce(sum, 0)

  return [result1, result2, 1598415, 3812909]
}
