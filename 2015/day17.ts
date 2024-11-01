import { Num } from '../common'

const LOAD_CAPACITY = 150

const getComboCount = (
  containers: number[],
  maxContainers = Number.MAX_SAFE_INTEGER,
  targetCapacity = LOAD_CAPACITY,
): number => {
  if (targetCapacity < 0 || maxContainers < 1) return 0
  if (targetCapacity === 0) return 1

  const counts = containers.map((size, index) =>
    getComboCount(
      containers.slice(index + 1),
      maxContainers - 1,
      targetCapacity - size,
    ),
  )

  return Num.sum(counts)
}

const getLeastContainersCount = (containers: number[]) => {
  let maxContainers = 1

  while (true) {
    const count = getComboCount(containers, maxContainers)
    if (count > 0) return count

    maxContainers += 1
  }
}

export default (rows: string[]) => {
  const input = rows.map(r => parseInt(r))

  const result1 = getComboCount(input)
  const result2 = getLeastContainersCount(input)

  return [result1, result2, 4372, 4]
}
