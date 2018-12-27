import * as common from './common'

const readInput = () => {
  const rows = common.readDayRows(7)
  const parse = common.parseByPattern('Step %w must be finished before step %w can begin.')

  const rules = rows.map(parse)

  const letters = common.unique([
    ...rules.map(x => x[0]),
    ...rules.map(x => x[1]),
  ]).sort()

  return { letters, rules }
}

const { letters, rules } = readInput()

const findAvailable = (current, unavailable = []) => {
  const prohibitions = rules.filter(x => !current.includes(x[0])).map(x => x[1])

  return letters.filter(v => !current.includes(v) && !prohibitions.includes(v) && !unavailable.includes(v))
}

const getWorkingOrder = (current = []) => {
  const [added] = findAvailable(current)

  return added ? getWorkingOrder([...current, added]) : current
}

const result1 = getWorkingOrder().join('')

console.log(result1) // OVXCKZBDEHINPFSTJLUYRWGAMQ


const DEFAULT_COST = 60
const WORKER_COUNT = 5

const getCost = letter => letter.charCodeAt(0) - 'A'.charCodeAt(0) + 1 + DEFAULT_COST

const costs = letters.reduce((acc, letter) => ({ ...acc, [letter]: getCost(letter) }), {})

const getTotalTime = (earlier, working) => {
  const time = working.length === 0 ? 0 : Math.min(...working.map(work => work.time))
  const finished = working
    .filter(work => work.time === time)
    .map(work => work.item)
  const done = [...earlier, ...finished]

  if (done.length === letters.length) {
    return time
  }

  const ongoing = working.filter(work => work.time > time)

  const unavailable = ongoing.map(work => work.item)
  const started = findAvailable(done, unavailable)
    .slice(0, WORKER_COUNT - working.length)
    .map(item => ({ item, time: costs[item] + time }))

  return getTotalTime(done, [...ongoing, ...started])
}

const result2 = getTotalTime([], [])

console.log(result2) // 955
