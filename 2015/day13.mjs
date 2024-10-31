'use strict'

import * as utils from './utils.mjs'

const readSeating = str => {
  const [to, , verb, happiness, ...rest] = str.split(' ')

  const from = rest.pop().slice(0, -1)
  const rawAmount = parseInt(happiness, 10)
  const amount = verb === 'gain' ? rawAmount : -rawAmount

  return { from, to, amount }
}

const combineAmounts = ({ from, to, amount: prevAmount }, index, seatings) => {
  const other = seatings.find(other => other.from === to && other.to === from)
  const amount = prevAmount + other.amount

  return { from, to, amount }
}

const getKeys = list => list.map((_, key) => key)

const addMe = (seatings, person) =>
  seatings.concat({ from: 'me', to: person, amount: 0 })

export default rows => {
  const seatings = rows.map(readSeating).map(combineAmounts)

  const people = utils.getNodes(seatings)
  const amounts = utils.getAmounts(people, seatings)
  const perms = utils.getCircularPermutations(getKeys(people))
  const limits = utils.getPermutationMinMax(perms, amounts)

  const seatings2 = people.reduce(addMe, seatings)

  const people2 = people.concat(['me'])
  const amounts2 = utils.getAmounts(people2, seatings2)
  const perms2 = utils.getCircularPermutations(getKeys(people2))
  const limits2 = utils.getPermutationMinMax(perms2, amounts2)

  return [limits.max, limits2.max, 618, 601]
}
