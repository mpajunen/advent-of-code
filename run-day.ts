import { readFileSync } from 'fs'

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

runDay().catch(console.error)
