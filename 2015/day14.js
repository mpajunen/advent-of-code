'use strict'

const R = require('ramda')

const readReindeer = str => {
  const [name, , , speed, , , duration, ...other] = str.split(' ')

  return {
    name,
    speed: parseInt(speed, 10),
    duration: parseInt(duration, 10),
    rest: parseInt(other.slice(-2, -1)[0], 10),
  }
}

const getTotalDistance =
  time =>
  ({ speed, duration, rest }) => {
    const period = duration + rest

    const fullCount = Math.floor(time / period)
    const extraTime = time % period

    return speed * (fullCount * duration + Math.min(extraTime, duration))
  }

const TIME = 2503

const getDistances =
  time =>
  ({ speed, duration, rest }) => {
    const period = duration + rest

    return new Array(time).fill(0).reduce((all, _, now) => {
      const running = now % period < duration
      const prev = all.length !== 0 ? all.slice(-1)[0] : 0

      all.push(running ? prev + speed : prev)

      return all
    }, [])
  }

export default rows => {
  const reindeer = rows.map(readReindeer)

  const totals = reindeer.map(getTotalDistance(TIME))
  const max = totals.reduce(R.max, 0)

  const distances = reindeer.map(getDistances(TIME))

  const getMaxValue = now =>
    distances.reduce((max, reindeer) => Math.max(max, reindeer[now]), 0)
  const getMaxIndexes = now => {
    const max = getMaxValue(now)

    return distances
      .map((reindeer, index) => (reindeer[now] === max ? index : null))
      .filter(x => x !== null)
  }

  const getPoints = distances =>
    distances[0].map((_, time) => getMaxIndexes(time))

  const points = getPoints(distances)

  const getCounts = values =>
    values.reduce((counts, timeValues) => {
      timeValues.forEach(value => (counts[value] += 1))

      return counts
    }, distances.slice(0).fill(0))

  const pointCounts = getCounts(points)
  const maxPoints = pointCounts.reduce(R.max, 0)

  return [max, maxPoints, 2640, 1102]
}
