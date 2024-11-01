import { List, Str } from '../common'

const WIDTH = 25
const HEIGHT = 6

export default function day8([row]: string[]): [unknown, unknown] {
  const layers = Str.chunk(WIDTH * HEIGHT, row)

  const [checkLayer] = List.minBy(image => Str.charCounts(image)[0], layers)
  const checkCounts = Str.charCounts(checkLayer)

  const getPixel = (index: number): string =>
    layers.reduce(
      (previous: string, current: string) =>
        previous === '2' ? current[index] : previous,
      '2',
    ) === '1'
      ? '#'
      : ' '
  const pixels = List.range(0, WIDTH * HEIGHT)
    .map(getPixel)
    .join('')

  return [
    checkCounts[1] * checkCounts[2], // 1806
    Str.chunk(WIDTH, pixels), // JAFRA
  ]
}
