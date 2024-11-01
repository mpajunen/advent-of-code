import produce from 'immer'
import { List, Num } from '../common'

type Monkey = ReturnType<typeof getMonkey>

const endNumber = (row: string) => Number(row.split(' ').pop())

type Operation = (n: number) => number

const operation = (calc: string): Operation => {
  const [, op, right] = calc.trim().split(' ') // Left is always old

  if (right === 'old') {
    return n => n * n // Always *
  }

  const value = Number(right)

  return op === '*' ? n => n * value : n => n + value
}

const getMonkey = (rows: string[]) => {
  const [numberRow, itemRow, operationRow, ...testRows] = rows

  const testPart = testRows.map(endNumber)

  return {
    number: Number(numberRow.slice(0, -1).split(' ')[1]),
    items: itemRow.split(': ')[1].split(', ').map(Number),
    operation: operation(operationRow.split(' = ')[1]),
    test: {
      divisible: testPart[0],
      trueTarget: testPart[1],
      falseTarget: testPart[2],
    },
    inspections: 0,
  }
}

const getInput = (rows: string[]) => List.splitBy('', rows).map(getMonkey)

const takeTurn = (denominator?: number) => (monkeys: Monkey[], index: number) =>
  produce(monkeys, m => {
    const monkey = monkeys[index]

    for (const item of monkey.items) {
      const operated = monkey.operation(item)
      const worry = denominator
        ? operated % denominator
        : Math.trunc(operated / 3)
      const target =
        worry % monkey.test.divisible === 0
          ? monkey.test.trueTarget
          : monkey.test.falseTarget

      m[target].items.push(worry)
    }
    m[monkey.number].inspections += monkey.items.length
    m[monkey.number].items = []
  })

const runRound =
  (denominator?: number) =>
  (monkeys: Monkey[]): Monkey[] =>
    List.range(0, monkeys.length).reduce(takeTurn(denominator), monkeys)

const runRounds = (
  monkeys: Monkey[],
  count: number,
  denominator?: number,
): Monkey[] => List.range(0, count).reduce(runRound(denominator), monkeys)

const monkeyBusiness = (monkeys: Monkey[]) => {
  const inspections = List.sort(monkeys.map(m => m.inspections)).reverse()

  return inspections[0] * inspections[1]
}

export default (rows: string[]) => {
  const monkeys = getInput(rows)

  const denominator = Num.product(monkeys.map(m => m.test.divisible))

  const result1 = monkeyBusiness(runRounds(monkeys, 20))
  const result2 = monkeyBusiness(runRounds(monkeys, 10_000, denominator))

  return [result1, result2, 55458, undefined]
}
