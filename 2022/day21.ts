import { List } from '../common'

type OpName = '+' | '-' | '*' | '/' | '='
type Op = (a: number, b: number) => number
type Ops = Record<OpName, Op>

type Monkey =
  | { name: string; kind: 'value'; value: number }
  | { name: string; kind: 'op'; op: OpName; left: string; right: string }
type Monkeys = Record<string, Monkey>

const getMonkey = (row: string): Monkey => {
  const [name, value] = row.split(': ')

  const parts = value.split(' ')

  return parts.length === 3
    ? { name, kind: 'op', op: parts[1] as OpName, left: parts[0], right: parts[2] }
    : { name, kind: 'value', value: Number(value) }
}

const getMonkeys = (rows: string[]): Monkeys =>
  List.mapBy(rows.map(getMonkey), m => m.name)

const operations: Ops = {
  '+': (l, r) => l + r,
  '-': (l, r) => l - r,
  '*': (l, r) => l * r,
  '/': (l, r) => l / r,
  '=': (l, r) => l === r ? 1 : 0,
}

const reverseOps: Record<'left' | 'right', Ops> = {
  left: {
    '+': (y, r) => y - r,
    '-': (y, r) => y + r,
    '*': (y, r) => y / r,
    '/': (y, r) => y * r,
    '=': (y, r) => r,
  },
  right: {
    '+': (y, l) => y - l,
    '-': (y, l) => l - y,
    '*': (y, l) => y / l,
    '/': (y, l) => l / y,
    '=': (y, l) => l,
  },
}

const createGetYell = (monkeys: Monkeys) => {
  const getYell = (name: string): number => {
    const monkey = monkeys[name]

    return monkey.kind === 'value'
      ? monkey.value
      : operations[monkey.op](getYell(monkey.left), getYell(monkey.right))
  }

  return getYell
}

const findOwnYell = (base: Monkeys): number => {
  const monkeys: Monkeys = { ...base, root: { ...base.root, op: '=' } as Monkey }

  const getYell = createGetYell(monkeys)

  const isDependent = (name: string) => {
    const monkey = monkeys[name]

    return monkey.kind === 'value'
      ? monkey.name === 'humn'
      : isDependent(monkey.left) || isDependent(monkey.right)
  }

  const findMatchingYell = (name: string, yell: number): number => {
    const monkey = monkeys[name]
    if (monkey.kind === 'value') {
      return yell
    }

    const [dependentSide, staticSide] = isDependent(monkey.left)
      ? ['left', 'right']
      : ['right', 'left']
    const value = getYell(monkey[staticSide])
    const reversed = reverseOps[dependentSide][monkey.op](yell, value)

    return findMatchingYell(monkey[dependentSide], reversed)
  }

  return findMatchingYell('root', 1)
}

export default (rows: string[]) => {
  const monkeys = getMonkeys(rows)

  const result1 = createGetYell(monkeys)('root')
  const result2 = findOwnYell(monkeys)

  return [result1, result2, 87457751482938, 3221245824363]
}
