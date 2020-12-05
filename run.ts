import { readFileSync } from 'fs'
import { range } from './common/common'

type Day = (rows: string[]) => [unknown, unknown]

const readDayRows = (year, day) =>
  readFileSync(`./${year}/input/day${day}.txt`, 'utf8')
    .trim()
    .split('\n')

const getCode = async (year: number, day: number): Promise<Day> => (await import(`./${year}/day${day}`)).default

const runDay = async (day = new Date().getDate(), year = new Date().getFullYear()) => {
  const input = readDayRows(year, day)
  const code = await getCode(year, day)

  const [result1, result2] = code(input)

  console.log(result1)
  console.log(result2)
}

const runYear = async (year = new Date().getFullYear()) => {
  const maxDay = year === new Date().getFullYear() ? new Date().getDate() : 25

  for (const day of range(1, maxDay + 1)) {
    console.log(`${year}: Day ${day}`)
    await runDay(day, year)
  }
}

const run = async (mode: string, ...calendar: string[]) => {
  const now = new Date()

  if (mode === 'day') {
    const [day, year] = calendar
    await runDay(day ? parseInt(day) : now.getDate(), year ? parseInt(year) : now.getFullYear())
  } else if (mode === 'year') {
    const [year] = calendar
    await runYear(year ? parseInt(year) : now.getFullYear())
  }
}

const [, , mode, ...calendar] = process.argv

run(mode, ...calendar).catch(console.error)
