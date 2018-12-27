import * as common from './common'

const readInput = () => {
  const [row] = common.readDayRows(8)

  const numbers = row.split(' ').map(n => parseInt(n, 10))

  return { numbers }
}

const { numbers } = readInput()

const buildNode = remaining => {
  let size = 2 // Headers
  const [childCount, metaCount] = remaining

  const children = []
  while (children.length < childCount) {
    const child = buildNode(remaining.slice(size))
    children.push(child)

    size += child.size
  }

  const meta = remaining.slice(size, size + metaCount)
  size += metaCount

  return { children, meta, size }
}

const root = buildNode(numbers)


const metaSum = node =>
  common.sum(node.meta) + common.sum(node.children.map(metaSum))

const result1 = metaSum(root)

console.log(result1) // 40977


const nodeValue = node => {
  if (node.children.length === 0) {
    return metaSum(node)
  }

  const referred = node.meta.map(num => node.children[num - 1]).filter(node => !!node)

  return common.sum(referred.map(nodeValue))
}

const result2 = nodeValue(root)

console.log(result2) // 27490
