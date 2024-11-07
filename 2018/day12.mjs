import * as common from './common'

const LEFT_2 = 1
const LEFT_1 = 2
const CURRENT = 4
const RIGHT_1 = 8
const RIGHT_2 = 16

const FLAGS = [LEFT_2, LEFT_1, CURRENT, RIGHT_1, RIGHT_2]

const readInput = rows => {
  const [first, ...rest] = rows

  const initialPairs = first
    .split(' ')[2]
    .split('')
    .map((char, index) => [index, char === '#'])
    .filter(([, hasPot]) => hasPot)
  const initial = new Map(initialPairs)

  const rules = new Map()
  rest.forEach(row => {
    const [pattern, , to] = row.split(' ')
    const from = common.sum(
      pattern.split('').map((char, index) => (char === '#' ? FLAGS[index] : 0)),
    )

    rules.set(from, to === '#')
  })

  return { initial, rules }
}

const getPatternKey = (values, index) =>
  common.sum(FLAGS.filter((_, i) => values.get(index - 2 + i)))

const step = rules => values => {
  const min = Math.min(...values.keys()) - 2
  const max = Math.max(...values.keys()) + 2

  const next = new Map()
  for (let i = min; i <= max; i++) {
    if (rules.get(getPatternKey(values, i))) {
      next.set(i, true)
    }
  }

  return next
}

const stepCount = (rules, count, values) =>
  common.range(0, count).reduce(step(rules), values)

const score = values => common.sum([...values.keys()])

const GENERATIONS_TEST = 20

const GENERATIONS_FINAL = 50000000000

const stepUntilStable = (rules, start) => {
  let values = start
  let steps = 0

  while (true) {
    const next = step(rules)(values)

    if ([...next.keys()].every(key => values.get(key - 1))) {
      return { steps, values }
    }

    steps += 1
    values = next
  }
}

const stableScore = ({ values, steps }) =>
  score(values) + values.size * (GENERATIONS_FINAL - steps)

export default rows => {
  const { rules, initial } = readInput(rows)

  const afterTwenty = stepCount(rules, GENERATIONS_TEST, initial)

  const result1 = score(afterTwenty)
  const result2 = stableScore(stepUntilStable(rules, initial))

  return [result1, result2, 2166, 2100000000061]
}
