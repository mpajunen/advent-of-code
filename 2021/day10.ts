import { List, Num } from '../common'

const pairs = { '(': ')', '[': ']', '{': '}', '<': '>' } as const

type Open = keyof typeof pairs
type Close = (typeof pairs)[Open]

const pointsCorrupted: Record<Close, number> = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
}
const pointsIncomplete: Record<Close, number> = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
}

const scoreIncomplete = (stack: Open[]): number =>
  stack
    .map(v => pairs[v])
    .reverse()
    .reduce((total, char) => total * 5 + pointsIncomplete[char], 0)

const parse = (row: string) => {
  const stack: Open[] = []

  for (const char of row) {
    if (char in pairs) {
      stack.push(char as Open)
    } else {
      const previous = stack.pop()

      if (pairs[previous] !== char) {
        return { status: 'corrupted', score: pointsCorrupted[char] }
      }
    }
  }

  return { status: 'incomplete', score: scoreIncomplete(stack) }
}

const middle = <T>(values: T[]): T => values[(values.length - 1) / 2]

export default (rows: string[]) => {
  const [corrupted, incomplete] = List.partition(
    l => l.status === 'corrupted',
    rows.map(parse),
  ).map(lines => lines.map(l => l.score))

  const result1 = Num.sum(corrupted)
  const result2 = middle(List.sort(incomplete))

  return [result1, result2, 369105, 3999363569]
}
