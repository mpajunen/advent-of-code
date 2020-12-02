import day1 from './2019/day1'
import day2 from './2019/day2'
import day3 from './2019/day3'
import day4 from './2019/day4'
import day6 from './2019/day6'
import day8 from './2019/day8'
import day10 from './2019/day10'
import day12 from './2019/day12'
import day14 from './2019/day14'
import day18 from './2019/day18'
import { readDayRows } from './common/common'

type Day = (rows: string[]) => [unknown, unknown]

const days: Record<number, Day> = {
  1: day1,
  2: day2,
  3: day3,
  4: day4,
  6: day6,
  8: day8,
  10: day10,
  12: day12,
  14: day14,
  18: day18,
}

const runDay = (day = new Date().getDate(), year = new Date().getFullYear()) => {
  const input = readDayRows(year, day)

  const [result1, result2] = days[day](input)

  console.log(result1)
  console.log(result2)
}

runDay(18)
