import { Grid, Input, Num, List, Str, Vec2 } from '../common'

const findContiguousSum = (nums: number[], target: number): number[] => {
  for (let i = 0; i < nums.length; i++) {
    let sum = nums[i]
    for (let j = i + 1; j < nums.length; j++) {
      sum += nums[j]
      if (sum === target) {
        return nums.slice(i, j)
      }
      if (sum > target) {
        break
      }
    }
  }

  return []
}

const PREAMBLE_SIZE = 25

export default (rows: string[]) => {
  const nums = rows.map(r => parseInt(r))

  const preamble = index => nums.slice(index - PREAMBLE_SIZE, index)
  const isValid = (num, i) => Num.pairSums(preamble(i)).includes(num)
  const getWeakness = target => {
    const range = findContiguousSum(nums, target)

    return Math.min(...range) + Math.max(...range)
  }

  const result1 = nums.find((n, i) => i >= PREAMBLE_SIZE && !isValid(n, i))
  const result2 = getWeakness(result1)

  return [result1, result2, 29221323, 4389369]
}
