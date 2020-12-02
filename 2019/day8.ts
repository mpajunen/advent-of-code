import * as common from '../common/common'

const WIDTH = 25
const HEIGHT = 6

export default function day8([row]: string[]): [unknown, unknown] {
  const layers = common.chunk(WIDTH * HEIGHT, row)

  const [checkLayer] = common.minBy(image => common.charCounts(image)[0], layers)
  const checkCounts = common.charCounts(checkLayer)

  const getPixel = (index: number): string =>
    layers.reduce((previous: string, current: string) => previous === '2' ? current[index] : previous, '2') === '1' ? '#' : ' '
  const pixels = common.range(0, WIDTH * HEIGHT).map(getPixel).join('')

  return [
    checkCounts[1] * checkCounts[2], // 1806
    common.chunk(WIDTH, pixels), // JAFRA
  ]
}
