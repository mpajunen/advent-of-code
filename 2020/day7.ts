import { Num } from '../common'

type Count = { color: string; count: number }
type Rule = { color: string; contains: Count[] }

const getRule = (row: string): Rule => {
  const [start, rest] = row.split(' contain ')

  const color = start.split(' ').slice(0, 2).join(' ')

  const contains = rest
    .split(', ')
    .map(r => r.split(' '))
    .flatMap(([count, style, color]) =>
      count === 'no'
        ? []
        : {
            count: parseInt(count),
            color: [style, color].join(' '),
          },
    )

  return { color, contains }
}

const MAIN_COLOR = 'shiny gold'

export default (rows: string[]) => {
  const rules = rows.map(getRule)
  const ruleMap = Object.fromEntries(rules.map(r => [r.color, r.contains]))

  const canHold = (bag: Count[]) =>
    bag.some(hold => hold.color === MAIN_COLOR || canHold(ruleMap[hold.color]))

  const getCount = (color: string) =>
    1 + Num.sum(ruleMap[color].map(r => r.count * getCount(r.color)))

  const result1 = rules.filter(r => canHold(r.contains)).length
  const result2 = getCount(MAIN_COLOR) - 1

  return [result1, result2, 274, 158730]
}
