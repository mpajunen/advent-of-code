const findPair = (nums: number[]) =>
  nums.flatMap(a => nums.flatMap(b => (a + b === 2020 ? a * b : [])))

const findTriplet = (nums: number[]) =>
  nums.flatMap(a =>
    nums.flatMap(b => nums.flatMap(c => (a + b + c === 2020 ? a * b * c : []))),
  )

export default (rows: string[]) => {
  const nums = rows.map(row => parseInt(row))

  const [result1] = findPair(nums)
  const [result2] = findTriplet(nums)

  return [result1, result2, 538464, 278783190]
}
