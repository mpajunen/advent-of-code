import { Num } from '../common'

const traverse = (trees: string[][]) => (slope: { x: number, y: number }) => {
  let treeCount = 0
  let x = 0
  let y = 0

  while (y < trees.length) {
    const location = trees[y][x % trees[0].length]

    treeCount += (location === '#' ? 1 : 0)

    x += slope.x
    y += slope.y
  }

  return treeCount
}

const slopes = [{ x: 1, y: 1 }, { x: 3, y: 1 }, { x: 5, y: 1 }, { x: 7, y: 1 }, { x: 1, y: 2 }]

export default (rows: string[]) => {
  const trees = rows.map(r => r.split(''))

  const result1 = traverse(trees)({ x: 3, y: 1 })
  const result2 = Num.product(slopes.map(traverse(trees)))

  return [result1, result2, 220, 2138320800]
}
