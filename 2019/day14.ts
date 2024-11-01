type ResourceCount = { resource: string; count: number }
type Reaction = { inputs: ResourceCount[]; output: ResourceCount }
type Reactions = Record<string, Reaction>

type Counts = Record<string, number>

const getReaction = (row: string): Reaction => {
  const getCount = (c: string): ResourceCount => {
    const [count, resource] = c.split(' ')

    return { resource, count: parseInt(count) }
  }
  const parts = row.split(' => ')

  return {
    inputs: parts[0].split(', ').map(getCount),
    output: getCount(parts[1]),
  }
}

const findOreCount = (
  reactions: Reactions,
  initial: ResourceCount[],
): number => {
  const required = [...initial]
  const extras: Counts = {}
  let oreCount = 0

  while (required.length > 0) {
    const { count, resource } = required.pop()

    const stock = extras[resource] ?? 0
    const spent = Math.min(count, stock)
    extras[resource] = stock - spent
    const need = count - spent

    if (need === 0) {
      continue
    }

    if (resource === 'ORE') {
      oreCount += count
    } else {
      const reaction = reactions[resource]
      const reactionCount = Math.ceil(need / reaction.output.count)
      const produced = reactionCount * reaction.output.count
      extras[resource] = produced - need

      required.push(
        ...reaction.inputs.map(i => ({
          resource: i.resource,
          count: i.count * reactionCount,
        })),
      )
    }
  }

  return oreCount
}

const findMaximum = (
  test: (input: number) => number,
  limit: number,
): number => {
  let lower = 1
  let upper

  while (upper === undefined || lower < upper) {
    const input =
      upper === undefined ? lower * 2 : Math.round((lower + upper) / 2)
    const result = test(input)

    if (result > limit) {
      upper = input - 1
    } else {
      lower = input
    }
  }

  return lower
}

const findMaxFuel = (reactions: Reactions, oreLimit: number): number =>
  findMaximum(
    count => findOreCount(reactions, [{ resource: 'FUEL', count }]),
    oreLimit,
  )

export default (rows: string[]) => {
  const reactions: Reactions = Object.fromEntries(
    rows.map(getReaction).map(r => [r.output.resource, r]),
  )

  const oreCount = findOreCount(reactions, [{ resource: 'FUEL', count: 1 }])

  return [oreCount, findMaxFuel(reactions, 1_000_000_000_000), 301997, 6216589]
}
