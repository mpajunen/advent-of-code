type Orbit = [string, string]

class Tree<T> {
  edges: Map<T, T>

  constructor(edges: Map<T, T>) {
    this.edges = edges
  }

  getAncestors = (node: T): T[] => {
    const current = this.edges.get(node)

    return current ? [...this.getAncestors(current), current] : []
  }

  getHopDistance = (a: T, b: T): number => {
    const start = this.getAncestors(a)
    const end = this.getAncestors(b)
    const common = start.filter(o => end.includes(o))

    return start.length + end.length - 2 * common.length
  }

  getNodes = (): T[] => Array.from(this.edges.keys())
}

export default (rows: string[]) => {
  const orbitPairs = rows.map(row => [row.slice(4), row.slice(0, 3)] as Orbit)

  const orbits = new Tree<string>(new Map(orbitPairs))

  const totalOrbits = orbits.getNodes().map(orbits.getAncestors).flat().length
  const santaDistance = orbits.getHopDistance('YOU', 'SAN')

  return [totalOrbits, santaDistance, 314247, 514]
}
