'use strict'

const fs = require('fs')
const immutable = require('immutable')
const R = require('ramda')

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

const aunts = fs
  .readFileSync('input/day16.txt', 'utf8')
  .trim()
  .split('\n')
  .map(readAunt)

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
  R.eqProps(current, interests, message)

const compareAunt = aunt =>
  R.reject(interestMatches(aunt.interests), R.keys(aunt.interests)).length === 0

const correct = aunts.filter(compareAunt)[0]

console.log(correct)

const getMessageOperator = interest => {
  let operator

  switch (interest) {
    case 'cats':
    case 'trees':
      operator = R.gt
      break
    case 'goldfish':
    case 'pomeranians':
      operator = R.lt
      break
    default:
      operator = R.equals
  }

  return operator
}

const getMessagePart = (value, interest) => {
  return {
    value,
    operator: getMessageOperator(interest),
  }
}

const message2 = immutable.Map(message).map(getMessagePart).toObject()

const interestMatches2 = interests => current => {
  const part = message2[current]

  return part.operator(interests[current], part.value)
}

const compareAunt2 = aunt =>
  R.reject(interestMatches2(aunt.interests), R.keys(aunt.interests)).length ===
  0

const correct2 = aunts.filter(compareAunt2)[0]

console.log(correct2)
