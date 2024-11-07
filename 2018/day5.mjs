import * as common from './common'

const isUpperCase = value => value.toUpperCase() === value

const readInput = row => {
  const polarities = row
    .split('')
    .map(c => ({ char: c.toLowerCase(), polarity: isUpperCase(c) }))

  return { polarities }
}

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

export default ([row]) => {
  const { polarities } = readInput(row)

  const result = {}
  common.alphabet.forEach(polymer => {
    const withoutPolymer = polarities.filter(p => p.char !== polymer)

    result[polymer] = reactions(withoutPolymer).length
  })

  const result1 = reactions(polarities).length
  const result2 = Math.min(...Object.values(result))

  return [result1, result2, 11754, 4098]
}
