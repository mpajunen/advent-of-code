import { Grid, List, Vec2 } from '../common'

type Pixel = '#' | '.'
type Image = Grid<Pixel>

const getInput = (rows: string[]) => {
  const [algorithm, , ...image] = rows

  return {
    algorithm: algorithm.split('') as Pixel[],
    image: new Grid(image.map(row => row.split(''))) as Image,
  }
}

const shifts: Vec2[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [0, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
].map(Vec2.fromTuple)

const inputPixels = (image: Image, outside: Pixel, position: Vec2) =>
  shifts.map(s => Vec2.add(position, s)).map(p => image.get(p) ?? outside)

const pixelKey = (pixels: Pixel[]) =>
  parseInt(pixels.map(p => p === '#' ? 1 : 0).join(''), 2)

const pixel = (algorithm: Pixel[], image: Image, outside: Pixel, position: Vec2) =>
  algorithm[pixelKey(inputPixels(image, outside, position))]

const enhance = (algorithm: Pixel[]) => (image: Image, enhancedTimes: number): Image => {
  const outside = enhancedTimes % 2 === 0 ? '.' : algorithm[0]

  return Grid.create(
    { x: image.size().x + 2, y: image.size().y + 2 },
    ({ x, y }) => pixel(algorithm, image, outside, { x: x - 1, y: y - 1 }),
  )
}

const enhanceTimes = (algorithm: Pixel[], original: Image, times: number) =>
  List.range(0, times).reduce(enhance(algorithm), original)

export default (rows: string[]) => {
  const { algorithm, image } = getInput(rows)

  const result1 = enhanceTimes(algorithm, image, 2).valueCounts()['#']
  const result2 = enhanceTimes(algorithm, image, 50).valueCounts()['#']

  return [result1, result2, 5680, 19766]
}
