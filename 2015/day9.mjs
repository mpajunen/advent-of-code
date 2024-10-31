'use strict'

import * as utils from './utils.mjs'

const readRoute = str => {
  const [from, , to, , distance] = str.split(' ')

  return {
    from,
    to,
    amount: parseInt(distance, 10),
  }
}

const getKeys = list => list.map((_, key) => key)

export default rows => {
  const routes = rows.map(readRoute)

  const places = utils.getNodes(routes)
  const distances = utils.getAmounts(places, routes)
  const perms = utils.getPermutations(getKeys(places))

  const limits = utils.getPermutationMinMax(perms, distances)

  return [limits.min, limits.max, 141, 736]
}
