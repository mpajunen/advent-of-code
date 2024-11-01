import * as common from './common'

const isUpperCase = value => value.toUpperCase() === value

const readInput = () => {
  const [row] = common.readDayRows(5)

  const polarities = row
    .split('')
    .map(c => ({ char: c.toLowerCase(), polarity: isUpperCase(c) }))

  return { polarities }
}

const { polarities } = readInput()

const reactions = original => {
  const result = []

  original.forEach(current => {
    const previous = result[result.length - 1]

    if (
      previous &&
      current.char === previous.char &&
      current.polarity !== previous.polarity
    ) {
      result.pop()
    } else {
      result.push(current)
    }
  })

  return result
}

const result1 = reactions(polarities).length

console.log(result1) // 1754

const result = {}
common.alphabet.forEach(polymer => {
  const withoutPolymer = polarities.filter(p => p.char !== polymer)

  result[polymer] = reactions(withoutPolymer).length
})

const result2 = Math.min(...Object.values(result))

console.log(result2) // 4098
