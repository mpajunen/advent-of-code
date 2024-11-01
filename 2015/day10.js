import { List } from '../common'

const lookAndSay = str => {
  let result = ''
  let count = 0
  let current = null

  for (let i = 0; i < str.length; i++) {
    if (str.charAt(i) === current) {
      count += 1
    } else {
      if (count > 0) {
        result += `${count}${current}`
      }

      current = str.charAt(i)
      count = 1
    }
  }

  result += `${count}${current}`

  return result
}

const iterate = (input, iterations) =>
  List.range(0, iterations).reduce(lookAndSay, input)

export default ([row]) => {
  const result1 = iterate(row, 40).length
  const result2 = iterate(row, 50).length

  return [result1, result2, 252594, 3579328]
}
