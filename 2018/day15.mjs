import { Grid, Num, Vec2 } from '../common'

const STARTING_HEALTH = 200
const DEFAULT_DAMAGE = 3
const CREATURES = ['E', 'G']
const FLOOR = '.'
const WALL = '#'

const INVALID_COST = 9999

const allAdjacent = position => Vec2.adjacent(position)

const createCreature = (kind, position) => ({
  kind,
  position,
  health: STARTING_HEALTH,
})

const comparePosition = (a, b) => a.y - b.y || a.x - b.x

const compareCreaturePosition = (creature1, creature2) =>
  comparePosition(creature1.position, creature2.position)

const createStart = inputRows => {
  const rawValues = inputRows
    .filter(row => row.startsWith('#'))
    .map(row => row.split(' ')[0].split(''))
  const raw = new Grid(rawValues)

  const room = raw.map(char => (CREATURES.includes(char) ? FLOOR : char))
  const creatures = raw.reduce(
    (acc, char, position) =>
      CREATURES.includes(char) ? [...acc, createCreature(char, position)] : acc,
    [],
  )

  return { room, creatures }
}

const findEnemies = (creatures, active) =>
  creatures.filter(c => c.health > 0 && c.kind !== active.kind)

const findAtPosition = (creatures, position) =>
  creatures.find(
    c => c.health > 0 && comparePosition(c.position, position) === 0,
  )

const game = (start, elfDamage = DEFAULT_DAMAGE) => {
  const { room } = start

  const allowedFor = (creatures, active) => position =>
    room.get(position) === FLOOR &&
    (comparePosition(active.position, position) === 0 ||
      findAtPosition(creatures, position) === undefined)

  const findTargetPositions = (creatures, active) => {
    const enemies = findEnemies(creatures, active)
    const targets = [].concat(
      ...enemies.map(enemy => enemy.position).map(allAdjacent),
    )

    return targets.filter(allowedFor(creatures, active))
  }

  const createCosts = (creatures, active, targets) => {
    const search = [active.position]

    const costs = room.copy()
    creatures
      .filter(c => c.health > 0)
      .forEach(c => costs.set(c.position, WALL))
    costs.set(active.position, 0)

    let i = 0
    let targetAt = undefined
    while (i < search.length) {
      const position = search[i]
      const cost = costs.get(position) + 1
      if (targetAt !== undefined && cost > targetAt) {
        continue
      }

      const newPositions = allAdjacent(position).filter(
        p => costs.get(p) === FLOOR,
      )

      newPositions.forEach(p => {
        costs.set(p, cost)
        if (targetAt === undefined && targets.includes(p)) {
          targetAt = cost
        }
      })
      search.push(...newPositions)

      i += 1
    }

    return costs
  }

  const findTarget = (targets, costs) => {
    const targetCosts = targets
      .map(t => costs.get(t))
      .map(c => (Number.isInteger(c) ? c : INVALID_COST))
    const minCost = Math.min(...targetCosts)
    if (minCost === INVALID_COST) {
      return undefined
    }

    const minTargets = targets.filter(
      (t, index) => targetCosts[index] === minCost,
    )

    return minTargets.sort(comparePosition)[0]
  }

  const findNewPosition = (target, costs) => {
    let cost = costs.get(target)
    let positions = [target]

    while (cost > 1) {
      cost -= 1

      const newPositions = []
      positions.forEach(position => {
        allAdjacent(position).forEach(p => {
          if (
            costs.get(p) === cost &&
            newPositions.every(earlier => comparePosition(earlier, p) !== 0)
          ) {
            newPositions.push(p)
          }
        })
      })

      positions = newPositions
    }

    return positions.sort(comparePosition)[0]
  }

  const creatureMovement = (creatures, active) => {
    const targets = findTargetPositions(creatures, active)
    const costs = createCosts(creatures, active, targets)
    const target = findTarget(targets, costs)

    if (!target) {
      return
    }

    active.position = findNewPosition(target, costs)
  }

  const findAttackTarget = (creatures, active) => {
    const targetSquares = allAdjacent(active.position)
    const targets = findEnemies(creatures, active).filter(enemy =>
      targetSquares.find(t => comparePosition(t, enemy.position) === 0),
    )

    if (targets.length === 0) {
      return
    }

    const minHealth = Math.min(...targets.map(t => t.health))

    return targets
      .filter(t => t.health === minHealth)
      .sort(compareCreaturePosition)[0]
  }

  const creatureAttack = (creatures, active) => {
    const target = findAttackTarget(creatures, active)
    if (!target) {
      return
    }

    target.health -= active.kind === 'E' ? elfDamage : DEFAULT_DAMAGE
  }

  const act = (creatures, active) => {
    creatureMovement(creatures, active)
    creatureAttack(creatures, active)
  }

  const playTurn = creatures =>
    creatures.sort(compareCreaturePosition).forEach(creature => {
      if (creature.health > 0) {
        act(creatures, creature)
      }
    })

  const inProgress = creatures => {
    const kinds = creatures.filter(c => c.health > 0).map(c => c.kind)

    return CREATURES.every(c => kinds.includes(c))
  }

  const getScore = (creatures, turn) =>
    turn * Num.sum(creatures.filter(c => c.health > 0).map(c => c.health))

  const playTillEnd = creatures => {
    let turn = 0

    while (inProgress(creatures)) {
      turn += 1

      playTurn(creatures)
    }

    return { creatures, turn, score: getScore(creatures, turn - 1) }
  }

  const playTurns = (creatures, turns) => {
    let turn = 0

    while (turn < turns) {
      turn += 1

      playTurn(creatures)
    }

    return { creatures, turn, score: getScore(creatures, turn - 1) }
  }

  const play = turns =>
    turns === undefined
      ? playTillEnd(start.creatures)
      : playTurns(start.creatures, turns)

  return { play }
}

const testPlay = (input, turns, elfDamage) => {
  const start = createStart(input)
  const { score } = game(start, elfDamage).play(turns)

  return score
}

const BOOSTED_DAMAGE = 15 // Determined empirically

export default input => {
  const result1 = testPlay(input)
  const result2 = testPlay(input, undefined, BOOSTED_DAMAGE)

  return [result1, result2, 188576, 57112]
}
