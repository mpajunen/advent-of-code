import { produce } from 'immer'
import { Num, List } from '../common'

/*
    Magic Missile costs 53 mana. It instantly does 4 damage.
    Drain costs 73 mana. It instantly does 2 damage and heals you for 2 hit points.
    Shield costs 113 mana. It starts an effect that lasts for 6 turns. While it is active, your armor is increased by 7.
    Poison costs 173 mana. It starts an effect that lasts for 6 turns. At the start of each turn while it is active, it deals the boss 3 damage.
    Recharge costs 229 mana. It starts an effect that lasts for 5 turns. At the start of each turn while it is active, it gives you 101 new mana.
*/
const spells = [
  // Model instant effects as lasting 1 turn:
  { cost: 53, damage: 4, heal: 0, armor: 0, mana: 0, turns: 1 },
  { cost: 73, damage: 2, heal: 2, armor: 0, mana: 0, turns: 1 },
  { cost: 113, damage: 0, heal: 0, armor: 7, mana: 0, turns: 6 },
  { cost: 173, damage: 3, heal: 0, armor: 0, mana: 0, turns: 6 },
  { cost: 229, damage: 0, heal: 0, armor: 0, mana: 101, turns: 5 },
] as const
const spellNumbers = [0, 1, 2, 3, 4] as const

// Early on the over time effects are more important than the instant effects.
// Recharge needs to be cast second to avoid running out of mana, but there is
// no advantage to casting it first.
const startingSequences = [
  List.repeat([3, 4, 2], 3).flat(), // (Poison, Recharge, Shield) x3
  List.repeat([2, 4, 3], 3).flat(), // (Shield, Recharge, Poison) x3
]

const effectKeys = ['damage', 'heal', 'armor', 'mana'] as const

type Effects = Record<(typeof effectKeys)[number], number>

type Actor = { hp: number; damage: number; armor: number; mana: number }

type State = {
  player: Actor
  boss: Actor
  effects: number[]
  manaSpent: number
  mode: 'normal' | 'hard'
}

const parseBoss = (rows: string[]) => {
  const [hp, damage] = rows.map(r => r.split(': ')[1]).map(n => parseInt(n))

  return { hp, damage, armor: 0, mana: 0 }
}

const getInitialState = (mode: 'normal' | 'hard', boss: Actor): State => ({
  player: { hp: 50, damage: 0, armor: 0, mana: 500 },
  boss,
  effects: spells.map(() => 0),
  manaSpent: 0,
  mode,
})

const activeEffectSum = (s: State): Effects => {
  const active = spells.filter((_, i) => s.effects[i] > 0)

  const entries = effectKeys.map(key => [
    key,
    Num.sum(active.map(spell => spell[key])),
  ])

  return Object.fromEntries(entries)
}

const playRound = (state: State, spellNumber: number): State =>
  produce(state, s => {
    const applyEffects = () => {
      const effects = activeEffectSum(s)

      s.player.hp += effects.heal
      s.player.armor = effects.armor
      s.player.mana += effects.mana
      s.boss.hp -= effects.damage

      s.effects = s.effects.map(turns => Math.max(0, turns - 1))
    }

    // Player turn
    if (s.mode === 'hard') {
      s.player.hp -= 1
    }
    applyEffects()

    const spell = spells[spellNumber]
    s.player.mana -= spell.cost
    s.effects[spellNumber] = spell.turns
    s.manaSpent += spell.cost

    // Boss turn
    applyEffects()

    s.player.hp -= Math.max(1, s.boss.damage - s.player.armor)
  })

const findLowestWinMana = (s: State): number => {
  if (s.boss.hp <= 0) {
    return s.manaSpent
  }
  if (s.player.hp <= 0) {
    return Number.MAX_SAFE_INTEGER
  }

  return Math.min(
    ...spellNumbers
      .filter(number => s.effects[number] <= 1)
      .filter(number => s.player.mana >= spells[number].cost)
      .map(number => playRound(s, number))
      .map(findLowestWinMana),
  )
}

const getWinningLowestMana = (initial: State): number =>
  Math.min(
    ...startingSequences
      .map(spellSequence => spellSequence.reduce(playRound, initial))
      .map(findLowestWinMana),
  )

export default (rows: string[]) => {
  const boss = parseBoss(rows)

  const result1 = getWinningLowestMana(getInitialState('normal', boss))
  const result2 = getWinningLowestMana(getInitialState('hard', boss))

  return [result1, result2, 1824, 1937]
}
