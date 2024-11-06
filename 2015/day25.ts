const generateNext = (prev: number) => (prev * 252533) % 33554393

const generateNth = (n: number) =>
  Array.from({ length: n - 1 }).reduce(generateNext, 20151125)

const getFillNumber = ([row, column]: [number, number]) => {
  const diagonal = row + column - 1
  const beforeDiagonal = (diagonal * (diagonal - 1)) / 2

  return beforeDiagonal + column
}

export default (rows: string[]) => {
  const cell = rows[0].match(/\d+/g).map(Number) as [number, number]

  const result1 = generateNth(getFillNumber(cell))

  return [result1, undefined, 2650453, undefined]
}
