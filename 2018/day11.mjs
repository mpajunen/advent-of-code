import { createGrid } from './Grid'

const input = 1788

const getValue = serial => ([x, y]) => {
  const rackId = x + 10
  const powerLevel = (rackId * y + serial) * rackId
  const digit = Math.floor(powerLevel / 100) % 10

  return digit - 5
}

const GRID_SIZE = 300
const SQUARE_SIZE = 3
const INVALID = -9999

const cells = createGrid(getValue(input), GRID_SIZE + 1)

const createPrefixSums = data => {
  const rows = []

  for (let i = 0; i < data.length; i++) {
    const row = data[i]

    rows.push([])
    for (let j = 0; j < row.length; j++) {
      rows[i][j] = data[i][j]
        + (i > 0 ? rows[i - 1][j] : 0)
        + (j > 0 ? rows[i][j - 1] : 0)
        - (i > 0 && j > 0 ? rows[i - 1][j - 1] : 0)
    }
  }

  return rows
}

const prefixSums = createPrefixSums(cells.rows())

const subSquareTotal = (point, size) => {
  const [x, y] = point
  if (x < 1 || x + size >= GRID_SIZE) {
    return INVALID
  }

  return prefixSums[x + size - 1][y + size - 1]
    - prefixSums[x - 1][y + size - 1]
    - prefixSums[x + size - 1][y - 1]
    + prefixSums[x - 1][y - 1]
}

const totals = cells.map((_, point) => subSquareTotal(point, SQUARE_SIZE))

const result1 = totals.findMax().point.join(',')

console.log(result1) // 235,35

const findLargestOfPoint = (_, [x, y]) => {
  let size = 0
  let largest = INVALID
  let largestAt = size

  while (x + size <= GRID_SIZE && y + size <= GRID_SIZE) {
    size += 1

    const value = subSquareTotal([x, y], size)

    if (value > largest) {
      largest = value
      largestAt = size
    }
  }

  return { largest, largestAt }
}

const findLargest = () => {
  const all = cells.map(findLargestOfPoint)
  const sizes = all.map(v => v.largest)

  const res = sizes.findMax()

  const place = all.findPlace(value => value.largest === res.max)
  const { largestAt } = all.get(place)

  return [...place, largestAt]
}

const result2 = findLargest().join(',')

console.log(result2) // 142,265,7
