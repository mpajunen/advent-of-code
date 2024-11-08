import { DefaultDict, List, Num } from '../common'

const getSleeps = actions => {
  if (actions.length < 2) {
    return []
  } else {
    const [asleep, awake, ...rest] = actions

    return [{ start: asleep.minute, end: awake.minute }, ...getSleeps(rest)]
  }
}

const readInput = rows => {
  const stamp = '1518-10-12 23:58'
  const parseRow = row => ({
    // [1518-10-12 23:58] Guard #421 begins shift
    time: row.substr(1, stamp.length),
    action: row.substr(stamp.length + 3),
  })

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

  return nights.map(night => ({
    guard: night.guard,
    shiftStart: night.shiftStart,
    sleeps: getSleeps(night.actions),
  }))
}

const MINUTES = 60

const createSlept = sleeps => {
  const addSlept = (all, sleep) => {
    sleep.sleeps.forEach(s => {
      List.range(s.start, s.end).forEach(min => {
        all[sleep.guard][min]++
      })
    })

    return all
  }

  return sleeps.reduce(addSlept, new DefaultDict(() => List.empty(MINUTES)))
}

const findGuard = (comparison, slept) => {
  const [guard] = List.maxBy(comparison, Object.keys(slept))

  const max = Math.max(...slept[guard])
  const maxAt = slept[guard].findIndex(s => s === max)

  return { guard, max, maxAt }
}

export default rows => {
  const input = readInput(rows)

  const slept = createSlept(input)
  const sleepy = findGuard(guard => Num.sum(slept[guard]), slept)
  const consistent = findGuard(guard => Math.max(...slept[guard]), slept)

  const result1 = sleepy.guard * sleepy.maxAt
  const result2 = consistent.guard * consistent.maxAt

  return [result1, result2, 142515, 5370]
}
