import { Input, List } from '../common'

type Valve = ReturnType<typeof getValve>
type Inp = ReturnType<typeof getInput>

const START_POSITION = 'AA'
const MINUTES_LIMIT = 30
const MINUTES_TO_TRAIN = 4

const parseValve = Input.parseByPattern<[string, number]>(
  'Valve %w has flow rate=%i',
)

const getInput = (rows: string[]) => {
  const allValves = rows.map(getValve)
  const rateEntries: [string, number][] = allValves
    .filter(v => v.rate > 0)
    .map(v => [v.name, v.rate])

  return {
    tunnels: buildSimpleTunnels(allValves),
    valveRates: Object.fromEntries(rateEntries),
  }
}

const getValve = (row: string) => {
  const parts = row.split('; ')
  const [name, rate] = parseValve(parts[0])
  const tunnels = parts[1].split(', ').map(subPart => subPart.slice(-2))

  return { name, rate, tunnels }
}

const buildSimpleTunnels = (allValves: Valve[]) => {
  // We're only interested in traveling to valves that can be opened
  const valves = allValves.filter(v => v.name === START_POSITION || v.rate > 0)
  const valveMap = Object.fromEntries(allValves.map(v => [v.name, v.tunnels]))

  const getPathsTo = (path: string[], to: string): string[][] => {
    const tunnels = valveMap[path[0]]

    if (tunnels.includes(to)) {
      return [[to, ...path]]
    }

    return tunnels
      .filter(tunnel => !path.includes(tunnel))
      .flatMap(tunnel => getPathsTo([tunnel, ...path], to))
  }
  const getShortestPathTo = (from: Valve, to: Valve) =>
    // Paths include start (extra step), but time is needed for opening the valve
    Math.min(...getPathsTo([from.name], to.name).map(p => p.length))

  return Object.fromEntries(
    valves.map(from => [
      from.name,
      Object.fromEntries(
        valves
          .filter(to => to.name !== from.name)
          .map(to => [to.name, getShortestPathTo(from, to)]),
      ),
    ]),
  )
}

type PathOption = { path: string[]; release: number }
type PathState = PathOption & { minutesLeft: number }

// Combine paths where exactly teh same valves have been visited
const combinePaths = (allPaths: PathOption[]): PathOption[] => {
  const groups = List.groupBy(o => List.sort(o.path).join(''), allPaths)

  return Object.values(groups).map(
    group => List.maxBy(path => path.release, group)[0],
  )
}

const buildPaths = ({ tunnels, valveRates }: Inp, startMinutes: number) => {
  const targets = Object.keys(valveRates)

  const buildNextStates = (state: PathState): PathState[] => {
    const position = state.path[0] ?? START_POSITION

    const possibleTargets = targets.filter(name => !state.path.includes(name))

    return possibleTargets.flatMap<PathState>(to => {
      const minutesLeft = state.minutesLeft - tunnels[position][to]
      const valveRelease = valveRates[to] * minutesLeft
      if (valveRelease <= 0) {
        return []
      }
      const release = state.release + valveRelease

      return { path: [to, ...state.path], minutesLeft, release }
    })
  }
  // Keep "partial" path states so example data also still works
  const buildAllStates = (state: PathState): PathState[] => [
    state,
    ...buildNextStates(state).flatMap(buildAllStates),
  ]

  const allPaths = buildAllStates({
    path: [],
    minutesLeft: startMinutes,
    release: 0,
  })

  return combinePaths(allPaths)
}

const findOptimalPairRelease = (paths: PathOption[]) => {
  let optimalRelease = 0

  for (const path1 of paths) {
    for (const path2 of paths) {
      if (!List.intersects(path1.path, path2.path)) {
        optimalRelease = Math.max(optimalRelease, path1.release + path2.release)
      }
    }
  }

  return optimalRelease
}

export default (rows: string[]) => {
  const input = getInput(rows)

  const soloPaths = buildPaths(input, MINUTES_LIMIT)
  const pathsWithHelp = buildPaths(input, MINUTES_LIMIT - MINUTES_TO_TRAIN)

  const result1 = Math.max(...soloPaths.map(p => p.release))
  const result2 = findOptimalPairRelease(pathsWithHelp)

  return [result1, result2, 1641, 2261]
}
