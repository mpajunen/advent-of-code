import { List } from '../common'

const getInput = (rows: string[]) => {
  const routes = rows
    .map(r => r.split('-'))
    .flatMap(([from, to]) => [
      [from, to],
      [to, from],
    ])
    .filter(([from, to]) => from !== 'end' && to !== 'start')

  const mapping = {}
  for (const [from, to] of routes) {
    mapping[from] = mapping[from] ?? []
    mapping[from].push(to)
  }

  return mapping
}

const cond1 = (path: string[]) => (next: string) =>
  next.toUpperCase() === next || !path.includes(next)

const hasNoDouble = (path: string[]) => {
  const counts = List.counts(path)

  return path.every(p => p.toUpperCase() === p || counts[p] === 1)
}

const cond2 = (path: string[]) => (next: string) =>
  next.toUpperCase() === next || !path.includes(next) || hasNoDouble(path)

type Cond = typeof cond1

const allRoutes = (
  mapping: Record<string, string[]>,
  cond: Cond,
): string[][] => {
  const routes = (path: string[]): string[][] => {
    const step = path[path.length - 1]
    if (step === 'end') {
      return [path]
    }
    const options = mapping[step].filter(cond(path))

    return options.flatMap(option => routes([...path, option]))
  }

  return routes(['start'])
}

export default (rows: string[]) => {
  const input = getInput(rows)

  const result1 = allRoutes(input, cond1).length
  const result2 = allRoutes(input, cond2).length

  return [result1, result2, 4241, undefined]
}
