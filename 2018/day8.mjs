import { Num } from '../common'

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

const metaSum = node => Num.sum(node.meta) + Num.sum(node.children.map(metaSum))

const nodeValue = node => {
  if (node.children.length === 0) {
    return metaSum(node)
  }

  const referred = node.meta
    .map(num => node.children[num - 1])
    .filter(node => !!node)

  return Num.sum(referred.map(nodeValue))
}

export default ([row]) => {
  const numbers = row.split(' ').map(Number)

  const root = buildNode(numbers)

  const result1 = metaSum(root)
  const result2 = nodeValue(root)

  return [result1, result2, 0, 27490]
}
