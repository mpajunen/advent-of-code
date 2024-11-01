import { Grid, Vec2 } from '../common'

const getInput = (rows: string[]) =>
  new Grid(rows.map(r => r.split('').map(Number)))

const step = (start: Grid<number>): Grid<number> => {
  const octopuses = start.map(energy => energy + 1)

  const flash = (position: Vec2) => {
    octopuses.set(position, 0)
    Vec2.allAdjacent(position).forEach(p => {
      const energy = octopuses.get(p) ?? -1
      if (energy >= 1) {
        octopuses.set(p, energy + 1)
      }
    })
  }

  while (true) {
    const flashing = octopuses.findPlace(energy => energy > 9)
    if (!flashing) {
      return octopuses
    }
    flash(flashing)
  }
}

const steps = (start: Grid<number>, count: number) => {
  let flashes = 0
  let octopuses = start
  let stepCount = 1
  for (stepCount; stepCount <= count; stepCount++) {
    octopuses = step(octopuses)
    const newFlashes = octopuses.valueCounts()[0] ?? 0
    flashes += newFlashes
    if (newFlashes === 100) {
      return { flashes, stepCount }
    }
  }

  return { flashes, stepCount }
}

export default (rows: string[]) => {
  const input = getInput(rows)

  const result1 = steps(input, 100).flashes
  const result2 = steps(input, 1000).stepCount

  return [result1, result2, 1637, 242]
}
