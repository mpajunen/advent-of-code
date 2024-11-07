const findFirstRepeat = (numbers, found = new Set([0]), current = 0) => {
  for (const n of numbers) {
    current += n

    if (found.has(current)) {
      return current
    }

    found.add(current)
  }

  return findFirstRepeat(numbers, found, current)
}

export default rows => {
  const numbers = rows.map(Number)

  const result1 = numbers.reduce((a, b) => a + b, 0)
  const result2 = findFirstRepeat(numbers)

  return [result1, result2, 0, 0]
}
