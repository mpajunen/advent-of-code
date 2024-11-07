import * as common from './common'

const readInput = rows => {
  const parse = common.parseByPattern(
    'Step %w must be finished before step %w can begin.',
  )

  const rules = rows.map(parse)

  const letters = common
    .unique([...rules.map(x => x[0]), ...rules.map(x => x[1])])
    .sort()

  return { letters, rules }
}

const findAvailable = ({ letters, rules }, current, unavailable = []) => {
  const prohibitions = rules.filter(x => !current.includes(x[0])).map(x => x[1])

  return letters.filter(
    v =>
      !current.includes(v) &&
      !prohibitions.includes(v) &&
      !unavailable.includes(v),
  )
}

const getWorkingOrder = (input, current = []) => {
  const [added] = findAvailable(input, current)

  return added ? getWorkingOrder(input, [...current, added]) : current
}

const DEFAULT_COST = 60
const WORKER_COUNT = 5

const getCost = letter =>
  letter.charCodeAt(0) - 'A'.charCodeAt(0) + 1 + DEFAULT_COST

const getTotalTime = (input, costs, earlier, working) => {
  const { letters } = input
  const time =
    working.length === 0 ? 0 : Math.min(...working.map(work => work.time))
  const finished = working
    .filter(work => work.time === time)
    .map(work => work.item)
  const done = [...earlier, ...finished]

  if (done.length === letters.length) {
    return time
  }

  const ongoing = working.filter(work => work.time > time)

  const unavailable = ongoing.map(work => work.item)
  const started = findAvailable(input, done, unavailable)
    .slice(0, WORKER_COUNT - working.length)
    .map(item => ({ item, time: costs[item] + time }))

  return getTotalTime(input, costs, done, [...ongoing, ...started])
}

export default rows => {
  const input = readInput(rows)

  const costs = input.letters.reduce(
    (acc, letter) => ({ ...acc, [letter]: getCost(letter) }),
    {},
  )

  const result1 = getWorkingOrder(input).join('')
  const result2 = getTotalTime(input, costs, [], [])

  return [result1, result2, 'OVXCKZBDEHINPFSTJLUYRWGAMQ', 955]
}
