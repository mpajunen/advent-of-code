import { List, Str } from '../common'

const WIDTH = 25
const HEIGHT = 6

export default ([row]: string[]) => {
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
  const text = Str.chunk(WIDTH, pixels).join('\n')

  return [checkCounts[1] * checkCounts[2], text, 1806, expectedText]
}

const expectedText = `
  ##  ##  #### ###   ##  
   # #  # #    #  # #  # 
   # #  # ###  #  # #  # 
   # #### #    ###  #### 
#  # #  # #    # #  #  # 
 ##  #  # #    #  # #  # `.slice(1) // Remove leading newline
