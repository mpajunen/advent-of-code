import { Input, List } from '../common'

const WEAK_DAMAGE_MULTIPLIER = 2

const readInput = (rows, boost = 0) => {
  const parseStart = Input.parseByPattern('%i units each with %i hit')
  const parseEnd = Input.parseByPattern(
    'an attack that does %i %w damage at initiative %i',
  )

  const parse = (row, id) => {
    const [start, rest] = row.split('points ')
    const [mid, end] = rest.split('with ')

    const [count, hitPoints] = parseStart(start)
    const [attackDamage, attackType, initiative] = parseEnd(end)

    const midParts = mid
      .slice(1, mid.length - 2)
      .split(';')
      .filter(s => s.length > 0)
      .map(s => s.trim())
    const { immune, weak } = midParts.reduce((acc, part) => {
      const name = part.split(' ')[0]
      const values = part.split(', ').map(p => p.split(' ').pop())

      return { ...acc, [name]: values }
    }, [])

    return {
      id,
      count,
      hitPoints,
      attackDamage: id < 10 ? attackDamage + boost : attackDamage,
      attackType,
      initiative,
      immune: immune || [],
      weak: weak || [],
      side: id < 10 ? 'system' : 'infection',
    }
  }

  return rows.filter(r => r.length > 20).map(parse)
}

const getEffectivePower = unit => unit.count * unit.attackDamage

const getPowerful = units => {
  const powerful = List.maxBy(getEffectivePower, units)
  const faster = List.maxBy(unit => unit.initiative, powerful)

  return faster[0]
}

const getTarget = (options, attacker) => {
  const weak = options.filter(u => u.weak.includes(attacker.attackType))
  const mostDamage =
    weak.length > 0
      ? weak
      : options.filter(u => !u.immune.includes(attacker.attackType))

  return getPowerful(mostDamage)
}

const createAttacks = units => {
  const attackers = []
  const targets = []

  while (attackers.length < units.length) {
    const attacker = getPowerful(
      units.filter(unit => !attackers.includes(unit)),
    )
    const options = units
      .filter(u => u.side !== attacker.side)
      .filter(unit => !targets.includes(unit))
    const target = getTarget(options, attacker)

    attackers.push(attacker)
    targets.push(target ? target : undefined)
  }

  return attackers
    .map((attacker, i) => ({ attacker, target: targets[i] }))
    .filter(attack => attack.target !== undefined)
    .sort((a, b) => b.attacker.initiative - a.attacker.initiative)
}

const makeAttack = (units, { attacker, target }) => {
  const weak = target.weak.includes(attacker.attackType)
  const power = getEffectivePower(attacker)
  const damage = weak ? WEAK_DAMAGE_MULTIPLIER * power : power

  const killed = Math.min(Math.floor(damage / target.hitPoints), target.count)

  target.count -= killed
}

const fight = units => {
  while (true) {
    const fighting = units.filter(u => u.count > 0)
    const attacks = createAttacks(fighting)
    if (attacks.length === 0) {
      break
    }

    attacks.forEach(attack => makeAttack(units, attack))
  }

  return units
}

const getTotalCounts = units =>
  units.reduce(
    (acc, unit) => ({ ...acc, [unit.side]: acc[unit.side] + unit.count }),
    {
      system: 0,
      infection: 0,
    },
  )

const BOOST = 65 // Empirically determined

export default rows => {
  const normalFight = fight(readInput(rows))
  const boostFight = fight(readInput(rows, BOOST))

  const result1 = getTotalCounts(normalFight).infection
  const result2 = getTotalCounts(boostFight).system

  return [result1, result2, 22083, 8975]
}
