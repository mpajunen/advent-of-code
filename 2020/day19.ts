import { Input, List } from '../common'

type Rule = string | number[] | { options: number[][] }
type Rules = Record<number, Rule>
type Input = { messages: string[]; rules: Rules }

const MAX_DEPTH = 30

const replacements = `
8: 42 | 42 8
11: 42 31 | 42 11 31
`

const getRule = (raw: string): Rule => {
  if (raw.match(/"\w"/)) {
    return raw.slice(1, 2)
  }

  const options = raw.split(' | ').map(s => s.split(' ').map(v => parseInt(v)))

  return options.length === 1 ? options[0] : { options }
}

const getIn = (rows: string[], fixedRules: string[] = []): Input => {
  const [rawRules, messages] = List.splitBy('', rows)
  const ruleEntries = [rawRules, fixedRules].flat().map(row => {
    const [num, rest] = row.split(': ')

    return [parseInt(num), getRule(rest)]
  })

  return { rules: Object.fromEntries(ruleEntries), messages }
}

const createMatch =
  (rules: Rules) =>
  (message: string): boolean => {
    const match = (r: Rule, options: string[], depth: number): string[] => {
      if (depth > MAX_DEPTH) {
        return []
      }

      if (typeof r === 'string') {
        return options.flatMap(s => (s[0] === r ? s.slice(1) : []))
      } else if (Array.isArray(r)) {
        return r.reduce(
          (acc, part) => match(rules[part], acc, depth + 1),
          options,
        )
      } else {
        return r.options.flatMap(p => match(p, options, depth + 1))
      }
    }

    return match(rules[0], [message], 0).includes('')
  }

export default (rows: string[]) => {
  const base = getIn(rows)
  const fixed = getIn(rows, replacements.trim().split('\n'))

  const result1 = base.messages.filter(createMatch(base.rules)).length
  const result2 = fixed.messages.filter(createMatch(fixed.rules)).length

  return [result1, result2, 203, 304]
}
