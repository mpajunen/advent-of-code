'use strict'

const buildInterests = (interests, raw) => {
  const [name, value] = raw.split(': ')
  interests[name] = parseInt(value, 10)

  return interests
}

const buildAuntInterests = raw => raw.split(', ').reduce(buildInterests, {})

const readAunt = line => {
  const [, number, ...interests] = line.split(' ')

  return {
    number: parseInt(number.slice(0, -1), 10),
    interests: buildAuntInterests(interests.join(' ')),
  }
}

const message = `
children: 3
cats: 7
samoyeds: 2
pomeranians: 3
akitas: 0
vizslas: 0
goldfish: 5
trees: 3
cars: 2
perfumes: 1`
  .trim()
  .split('\n')
  .reduce(buildInterests, {})

const interestMatches = interests => current =>
  interests[current] === message[current]

const compareAunt = aunt =>
  Object.keys(aunt.interests).every(interestMatches(aunt.interests))

const getMessageOperator = interest => {
  let operator

  switch (interest) {
    case 'cats':
    case 'trees':
      operator = (a, b) => a > b
      break
    case 'goldfish':
    case 'pomeranians':
      operator = (a, b) => a < b
      break
    default:
      operator = (a, b) => a === b
  }

  return operator
}

const getMessagePart = ([interest, value]) => [
  interest,
  { value, operator: getMessageOperator(interest) },
]

const message2 = Object.fromEntries(Object.entries(message).map(getMessagePart))

const interestMatches2 = interests => current => {
  const part = message2[current]

  return part.operator(interests[current], part.value)
}

const compareAunt2 = aunt =>
  Object.keys(aunt.interests).every(interestMatches2(aunt.interests))

export default rows => {
  const aunts = rows.map(readAunt)

  const correct = aunts.find(compareAunt)
  const correct2 = aunts.find(compareAunt2)

  return [correct.number, correct2.number, 213, 323]
}
