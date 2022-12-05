import { List, Vec3 } from '../common'

const getInput = (rows: string[]) => {
  const scanners = List.splitBy('', rows)

  return scanners.map(s => s.slice(1).map(Vec3.fromString)).map((beacons, id) => ({ id, beacons }))
}

type Scanner = { id: number, beacons: Vec3[] }
type Match = Scanner & { origin: Vec3 }

const checkMatch = (match: Match, scanner: Scanner): Match | undefined => {
  for (const rotation of Vec3.rotations) {
    const rotated = scanner.beacons.map(beacon => Vec3.rotate(rotation, beacon))

    for (const a of match.beacons) {
      for (const b of rotated) {
        const origin = Vec3.subtract(a, b)
        const shifted = rotated.map(r => Vec3.add(r, origin))

        const matchingVectors = shifted.filter(s => match.beacons.some(m => Vec3.equal(m, s)))

        if (matchingVectors.length >= 12) {
          return { id: scanner.id, beacons: shifted, origin }
        }
      }
    }
  }

  return undefined
}

const findSingleMatches = (match: Match, remaining: Scanner[]): Match[] =>
  remaining.flatMap(r => checkMatch(match, r) ?? [])

const findMatches = ([first, ...remaining]: Scanner[]): Match[] => {
  const matches = [{ ...first, origin: Vec3.origin }]
  let checkIndex = 0

  while (remaining.length > 0) {
    matches.push(...findSingleMatches(matches[checkIndex], remaining))

    const foundIds = matches.map(m => m.id)
    remaining = remaining.filter(s => !foundIds.includes(s.id))
    checkIndex += 1
  }

  return matches
}

const largest = (matches: Match[]): number =>
  Math.max(...matches.flatMap(a => matches.map(b => Vec3.manhattan(a.origin, b.origin))))

export default (rows: string[]) => {
  const input = getInput(rows)

  const matches = findMatches(input)

  const allBeacons = matches.flatMap(m => m.beacons)
  const uniques = List.unique(allBeacons.map(Vec3.toString))

  const result1 = uniques.length
  const result2 = largest(matches)

  return [result1, result2, 332, 8507]
}
