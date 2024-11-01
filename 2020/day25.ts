import { List } from '../common'

const transform = (n: number, subject: number): number =>
  (n * subject) % 20201227

const findLoopSize = (n: number): number => {
  let size = 0
  let result = 1

  while (result !== n) {
    size += 1
    result = transform(result, 7)
  }

  return size
}

const transformTimes = (subject: number, times: number) =>
  List.range(0, times).reduce(n => transform(n, subject), 1)

export default (rows: string[]) => {
  const pub = rows.map(r => parseInt(r))

  const sizes = pub.map(findLoopSize)

  const result1 = transformTimes(pub[1], sizes[0])

  return [result1, undefined, 354320, undefined]
}
