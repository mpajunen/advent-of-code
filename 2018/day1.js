const fs = require('fs')

const raw = fs.readFileSync('./day1.txt', 'utf8')

const numbers = raw
  .split('\n')
  .filter(row => !!row)
  .map(row => parseInt(row, 10))

const result1 = numbers.reduce((a, b) => a + b, 0)

console.log(result1)

const findFirstRepeat = (found = new Set([0]), current = 0) => {
  for (const n of numbers) {
    current += n

    if (found.has(current)) {
      return current
    }

    found.add(current)
  }

  return findFirstRepeat(found, current)
}

console.log(findFirstRepeat())
