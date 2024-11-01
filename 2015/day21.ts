import { List, Num } from '../common'

const itemText = `Weapons:    Cost  Damage  Armor
Dagger        8     4       0
Shortsword   10     5       0
Warhammer    25     6       0
Longsword    40     7       0
Greataxe     74     8       0

Armor:      Cost  Damage  Armor
Leather      13     0       1
Chainmail    31     0       2
Splintmail   53     0       3
Bandedmail   75     0       4
Platemail   102     0       5

Rings:      Cost  Damage  Armor
Damage +1    25     1       0
Damage +2    50     2       0
Damage +3   100     3       0
Defense +1   20     0       1
Defense +2   40     0       2
Defense +3   80     0       3`

const categoryLimits = [
  { name: 'Weapons', min: 1, max: 1 },
  { name: 'Armor', min: 0, max: 1 },
  { name: 'Rings', min: 0, max: 2 },
]
type CategoryLimit = (typeof categoryLimits)[number]

type Actor = { hp: number; damage: number; armor: number }
type Item = { name: string; cost: number; damage: number; armor: number }
type ItemCategory = { name: string; items: Item[] }

const playerBase: Actor = { hp: 100, damage: 0, armor: 0 }

const parseItems = (text: string) => {
  const categories = text.split('\n\n')

  return categories.map(category => {
    const [nameRow, ...itemRows] = category.split('\n')

    const name = nameRow.split(':')[0]
    const items = itemRows.map(row => {
      const [name, cost, damage, armor] = row.split(/\s\s+/)
      return {
        name,
        cost: parseInt(cost),
        damage: parseInt(damage),
        armor: parseInt(armor),
      }
    })

    return { name, items }
  })
}

const applyItems = (actor: Actor, items: Item[]) => {
  const result = { ...actor }

  for (const item of items) {
    result.damage += item.damage
    result.armor += item.armor
  }

  return result
}

const totalCost = (items: Item[]) => Num.sum(items.map(i => i.cost))

const getItemCombinations = (
  available: Item[],
  leftToPick: number,
  picked: Item[] = [],
): Item[][] => {
  if (leftToPick === 0) {
    return [picked]
  }

  return available.flatMap((item, index) => {
    const remaining = available.slice(index)

    return getItemCombinations(remaining, leftToPick - 1, [...picked, item])
  })
}

const getCategoryCombinations = (items: Item[], limit: CategoryLimit) =>
  List.range(limit.min, limit.max + 1).flatMap(n =>
    getItemCombinations(items, n),
  )

function* getAllCombinations(allItems: ItemCategory[]) {
  const categories = categoryLimits.map((limit, index) =>
    getCategoryCombinations(allItems[index].items, limit),
  )

  for (const weapons of categories[0]) {
    for (const armor of categories[1]) {
      for (const rings of categories[2]) {
        yield [...weapons, ...armor, ...rings]
      }
    }
  }
}

const turnsToBeat = (attacker: Actor, defender: Actor) =>
  Math.ceil(defender.hp / Math.max(1, attacker.damage - defender.armor))

const isWin = (player: Actor, boss: Actor) =>
  turnsToBeat(player, boss) <= turnsToBeat(boss, player)

const findLimitCost = (
  allItems: ItemCategory[],
  boss: Actor,
  toWin: boolean,
) => {
  let limit = toWin ? Number.MAX_SAFE_INTEGER : 0

  for (const items of getAllCombinations(allItems)) {
    const cost = totalCost(items)
    if (cost > limit === toWin) {
      continue
    }

    const player = applyItems(playerBase, items)
    if (isWin(player, boss) === toWin) {
      limit = cost
    }
  }

  return limit
}

const getInput = (rows: string[]) => {
  const [hp, damage, armor] = rows
    .map(r => r.split(': ')[1])
    .map(n => parseInt(n))

  return { hp, damage, armor }
}

export default (rows: string[]) => {
  const boss = getInput(rows)

  const items = parseItems(itemText)

  const result1 = findLimitCost(items, boss, true)
  const result2 = findLimitCost(items, boss, false)

  return [result1, result2, 78, 148]
}
