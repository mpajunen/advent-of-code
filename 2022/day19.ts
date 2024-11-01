import produce from 'immer'
import { Input, List, Num } from '../common'

const parse = Input.parseByPattern<number[]>(
  'Blueprint %i: Each ore robot costs %i ore. Each clay robot costs %i ore. Each obsidian robot costs %i ore and %i clay. Each geode robot costs %i ore and %i obsidian.',
)

const RESOURCES = ['ore', 'clay', 'obsidian', 'geode'] as const

type Resource = (typeof RESOURCES)[number]
type Cost = { resource: Resource; amount: number }
type Blueprint = { id: number; robotCosts: Record<Resource, Cost[]> }

const getBlueprint = (row: number[]): Blueprint => ({
  id: row[0],
  robotCosts: {
    ore: [{ resource: 'ore', amount: row[1] }],
    clay: [{ resource: 'ore', amount: row[2] }],
    obsidian: [
      { resource: 'ore', amount: row[3] },
      { resource: 'clay', amount: row[4] },
    ],
    geode: [
      { resource: 'ore', amount: row[5] },
      { resource: 'obsidian', amount: row[6] },
    ],
  },
})

const getBlueprints = (rows: string[]) => rows.map(parse).map(getBlueprint)

const getInitialState = () => ({
  time: 0,
  robots: { ore: 1, clay: 0, obsidian: 0, geode: 0 },
  resources: { ore: 0, clay: 0, obsidian: 0, geode: 0 },
})

type State = ReturnType<typeof getInitialState>

const UNAVAILABLE_TIME = 999

const getGeodeMax =
  (timeMax: number) =>
  (blueprint: Blueprint): number => {
    const { robotCosts } = blueprint

    const changeState = (state: State, minutes: number, robot?: Resource) =>
      produce(state, s => {
        s.time += minutes

        if (robot) {
          robotCosts[robot].forEach(cost => {
            s.resources[cost.resource] -= cost.amount
          })
          s.robots[robot] += 1
        }

        RESOURCES.forEach(resource => {
          s.resources[resource] += state.robots[resource] * minutes
        })
      })

    const getTimeToAccumulate =
      (s: State) =>
      ({ amount, resource }: Cost) =>
        s.robots[resource] === 0
          ? UNAVAILABLE_TIME
          : Math.ceil((amount - s.resources[resource]) / s.robots[resource])
    const getTimeToBuild = (s: State, robot: Resource) =>
      Math.max(...robotCosts[robot].map(getTimeToAccumulate(s)), 0) + 1
    const buildRobot = (state: State) => (robot: Resource) =>
      changeState(state, getTimeToBuild(state, robot), robot)
    const buildRobotOptions = (start: State): State[] =>
      RESOURCES.map(buildRobot(start)).filter(s => s.time <= timeMax)

    const wait = (state: State): State =>
      changeState(state, timeMax - state.time)

    const RESOURCE_VALUES = { geode: 100000, obsidian: 100, clay: 10, ore: 2 }
    const getStateResourceValue = (s: State) => (resource: Resource) =>
      (s.resources[resource] + (timeMax - s.time) * s.robots[resource]) *
      RESOURCE_VALUES[resource]
    const getStateValue = (state: State) =>
      -Num.sum(RESOURCES.map(getStateResourceValue(state)))

    const getNextStates = (state: State): State[] => [
      wait(state),
      ...buildRobotOptions(state),
    ]

    const getBestStates = (states: State[]): State[] => {
      const minTime = Math.min(...states.map(s => s.time))
      if (minTime === timeMax) {
        return states
      }

      const all = states.flatMap(s =>
        s.time === minTime ? getNextStates(s) : s,
      )

      return getBestStates(List.sortBy(getStateValue, all).slice(0, 1000))
    }

    const states = getBestStates([getInitialState()])

    return Math.max(...states.map(s => s.resources.geode))
  }

export default (rows: string[]) => {
  const blueprints = getBlueprints(rows)

  const qualityLevels = blueprints
    .map(getGeodeMax(24))
    .map((geodes, index) => blueprints[index].id * geodes)

  const geodeCounts = blueprints.slice(0, 3).map(getGeodeMax(32))

  const result1 = Num.sum(qualityLevels)
  const result2 = Num.product(geodeCounts)

  return [result1, result2, 1413, 21080]
}
