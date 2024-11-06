import { List } from '../common'

const deliver = (
  target: number,
  presentMultiplier: number,
  deliveryLimit = Number.MAX_SAFE_INTEGER,
) => {
  const deliverFirstHouses = (lastHouse = 1): number => {
    const houses = List.empty(lastHouse + 1)

    for (let elf = 1; elf <= lastHouse; elf++) {
      const elfLastHouse = Math.min(lastHouse, elf * deliveryLimit)

      for (let house = elf; house <= elfLastHouse; house += elf) {
        houses[house] += elf * presentMultiplier
      }
    }

    const lowestHouse = houses.findIndex(presents => presents > target)

    return lowestHouse >= 0 ? lowestHouse : deliverFirstHouses(lastHouse * 2)
  }

  return deliverFirstHouses()
}

export default (rows: string[]) => {
  const target = parseInt(rows[0])

  const result1 = deliver(target, 10)
  const result2 = deliver(target, 11, 50)

  return [result1, result2, 776160, 786240]
}
