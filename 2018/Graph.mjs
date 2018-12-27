import * as common from './common'

const findEdges = (vertices, checkEdge) =>
  vertices
    .map(item => common.findIndices(compare => checkEdge(item, compare), vertices))
    .map((itemTo, from) => itemTo.map(to => [from, to]))
    .reduce((all, item) => [...all, ...item])

export const createGraph = (vertices, edgeExists) =>
  new Graph(vertices, findEdges(vertices, edgeExists))

export default class Graph {
  constructor(vertices, edges) {
    this.vertices = vertices
    this.neighbors = common.emptyArray(vertices.length, () => [])
    this.edges = []
    edges.forEach(edge => {
      this.addEdge(edge)
    })
  }

  addEdge([from, to]) {
    this.edges.push([from, to])
    this.neighbors[from].push(to)
  }

  getDisconnectedGroups() {
    const groups = []

    const fitsGroup = index => group => common.intersection(group, this.neighbors[index]).length > 0

    this.vertices.forEach((_, item) => {
      const fitIndices = common.findIndices(fitsGroup(item), groups)

      if (fitIndices.length > 0) {
        const newGroup = [item]
        fitIndices.forEach(index => {
          newGroup.push(...groups[index])
          groups[index] = []
        })
        groups.push(newGroup)
      } else {
        groups.push([item])
      }
    })

    return groups.filter(g => g.length > 0)
  }
}
