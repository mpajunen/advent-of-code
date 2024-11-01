import { Input, List, Num } from '../common'

type Range = [number, number]
type Rule = { name: string; ranges: Range[] }
type Ticket = number[]
type Input = { rules: Rule[]; own: Ticket; nearby: Ticket[] }

type RawRule = [string, number, number, number, number]
type Indices = { name: string; indices: number[] }

const read = (rows: string[]): Input => {
  const [rawRules, [, own], [, ...nearby]] = List.splitBy('', rows)

  const parseRule = Input.parseByPattern<RawRule>('%w: %i-%i or %i-%i')
  const getRuleEntry = ([name, min1, max1, min2, max2]: RawRule): Rule => ({
    name,
    ranges: [
      [min1, max1],
      [min2, max2],
    ],
  })
  const getTicket = (row: string) => row.split(',').map(n => parseInt(n))

  return {
    rules: rawRules.map(parseRule).map(getRuleEntry),
    own: getTicket(own),
    nearby: nearby.map(getTicket),
  }
}

const isInRange = ([min, max]: Range, num: number) => num >= min && num <= max

const isValidValue = ({ ranges }: Rule, num: number) =>
  ranges.some(range => isInRange(range, num))

const getTicketErrors = (rules: Rule[]) => (ticket: Ticket) =>
  ticket.filter(n => !rules.some(rule => isValidValue(rule, n)))

const getErrorRate = (rules: Rule[], tickets: Ticket[]) =>
  Num.sum(tickets.flatMap(getTicketErrors(rules)))

const isPotentiallyValid = (rules: Rule[]) => (ticket: Ticket) =>
  getTicketErrors(rules)(ticket).length === 0

const findPotentialIndices = (tickets: Ticket[], rule: Rule): number[] =>
  List.range(0, tickets[0].length).filter(index =>
    tickets.map(t => t[index]).every(val => isValidValue(rule, val)),
  )

const findIndices = (possible: Indices[]): Indices[] => {
  if (possible.length === 1) {
    return possible
  }

  const [[single], rest] = List.partition(p => p.indices.length === 1, possible)
  const found = single.indices[0]
  const remaining = rest.map(p => ({
    name: p.name,
    indices: p.indices.filter(i => i !== found),
  }))

  return [single, ...findIndices(remaining)]
}

const getFieldOrder = (input: Input): string[] => {
  const maybeValid = input.nearby.filter(isPotentiallyValid(input.rules))
  const possible = input.rules.map(rule => ({
    name: rule.name,
    indices: findPotentialIndices(maybeValid, rule),
  }))

  return List.sortBy(i => i.indices[0], findIndices(possible)).map(i => i.name)
}

export default (rows: string[]) => {
  const input = read(rows)

  const own = List.zip(getFieldOrder(input), input.own)

  const result1 = getErrorRate(input.rules, input.nearby)
  const result2 = Num.product(
    own.filter(o => o[0].startsWith('departure')).map(o => o[1]),
  )

  return [result1, result2, 23954, 453459307723]
}
