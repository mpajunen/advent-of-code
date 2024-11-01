import * as common from './common'

const getSleeps = actions => {
  if (actions.length < 2) {
    return []
  } else {
    const [asleep, awake, ...rest] = actions

    return [{ start: asleep.minute, end: awake.minute }, ...getSleeps(rest)]
  }
}

const readInput = () => {
  const stamp = '1518-10-12 23:58'
  const parseRow = row => ({
    // [1518-10-12 23:58] Guard #421 begins shift
    time: row.substr(1, stamp.length),
    action: row.substr(stamp.length + 3),
  })

  const rows = common.readDayRows(4)
  const events = rows.map(parseRow).sort((a, b) => (a.time < b.time ? -1 : 1))

  const nights = events.reduce((n, event) => {
    if (event.action.startsWith('Guard')) {
      const [, rawNumber] = event.action.split(' ')
      n.push({
        guard: parseInt(rawNumber.substr(1), 10),
        shiftStart: event.time,
        actions: [],
      })
    } else {
      n[n.length - 1].actions.push({
        minute: parseInt(event.time.substring(stamp.length - 2), 10),
        action: event.action,
      })
    }

    return n
  }, [])

  const sleeps = nights.map(night => ({
    guard: night.guard,
    shiftStart: night.shiftStart,
    sleeps: getSleeps(night.actions),
  }))

  return { sleeps }
}

const input = readInput()

const MINUTES = 60

const createSlept = sleeps => {
  const addSlept = (all, sleep) => {
    sleep.sleeps.forEach(s => {
      common.range(s.start, s.end).forEach(min => {
        all[sleep.guard][min]++
      })
    })

    return all
  }

  return sleeps.reduce(
    addSlept,
    new common.DefaultDict(() => common.emptyArray(MINUTES)),
  )
}

const findGuard = (comparison, slept) => {
  const [guard] = common.maxBy(comparison, Object.keys(slept))

  const max = Math.max(...slept[guard])
  const maxAt = slept[guard].findIndex(s => s === max)

  return { guard, max, maxAt }
}

const slept = createSlept(input.sleeps)

const sleepy = findGuard(guard => common.sum(slept[guard]), slept)

const result1 = sleepy.guard * sleepy.maxAt

console.log(result1) // 142515

const consistent = findGuard(guard => Math.max(...slept[guard]), slept)

const result2 = consistent.guard * consistent.maxAt

console.log(result2) // 5370
