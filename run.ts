import { readFileSync } from 'fs'
import { List } from './common'

type Answer = number | string
type Day = (
  rows: string[],
) => [Answer, Answer, Answer | undefined, Answer | undefined]

const readDayRows = (year, day) =>
  readFileSync(`./${year}/input/day${day}.txt`, 'utf8').trimEnd().split('\n')

const getCode = async (year: number, day: number): Promise<Day> =>
  (await import(`./${year}/day${day}`)).default

const printResult = (result: Answer, expected: Answer) => {
  console.log(result)
  if (expected && result !== expected) {
    console.log(`Expected ${expected}, got ${result}!`)
  }
}

const runDay = async (
  day = new Date().getDate(),
  year = new Date().getFullYear(),
) => {
  const input = readDayRows(year, day)
  const code = await getCode(year, day)

  const [result1, result2, expected1, expected2] = code(input)

  printResult(result1, expected1)
  printResult(result2, expected2)
}

const runYear = async (year = new Date().getFullYear()) => {
  const maxDay = year === new Date().getFullYear() ? new Date().getDate() : 25

  const yearStart = Date.now()

  for (const day of List.range(1, maxDay + 1)) {
    console.log('----------------------------------------')
    console.log(`${year}: Day ${day}`)
    const start = Date.now()

    try {
      await runDay(day, year)
    } catch (error) {
      console.error((error as Error).message)
    }

    const end = Date.now()
    console.log(`Time: ${(end - start) / 1000} s`)
  }

  const yearEnd = Date.now()
  console.log('----------------------------------------')
  console.log(`Total time: ${(yearEnd - yearStart) / 1000} s`)
  console.log('----------------------------------------')
}

const run = async (mode: string, ...calendar: string[]) => {
  const now = new Date()

  if (mode === 'day') {
    const [day, year] = calendar
    await runDay(
      day ? parseInt(day) : now.getDate(),
      year ? parseInt(year) : now.getFullYear(),
    )
  } else if (mode === 'year') {
    const [year] = calendar
    await runYear(year ? parseInt(year) : now.getFullYear())
  }
}

const [, , mode, ...calendar] = process.argv

run(mode, ...calendar).catch(console.error)
