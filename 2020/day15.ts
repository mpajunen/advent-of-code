const speakUntil = (start: number[], limit: number): number => {
  const prev: Record<number, number> = {}
  const earlier: Record<number, number> = {}

  start.forEach((n, index) => {
    prev[n] = index
  })
  let index = start.length
  let latest = start[start.length - 1]

  while (index < limit) {
    latest = earlier[latest] !== undefined
      ? prev[latest] - earlier[latest]
      : 0

    earlier[latest] = prev[latest]
    prev[latest] = index

    index += 1

    if (index % 100000 === 0) {
      console.log(index)
    }
  }

  return latest
}

export default ([row]: string[]) => {
  const input = row.split(',').map(n => parseInt(n))

  const result1 = speakUntil(input, 2020)
  const result2 = speakUntil(input, 30_000_000)

  return [result1, result2, 1111, undefined]
}
