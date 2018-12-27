import * as common from './common'
import Grid, { add } from './Grid'

const railReplacements =
  { '<': '-', '>': '-', '^': '|', 'v': '|' }

const crossings = {
  '<': ['v', '<', '^'],
  '>': ['^', '>', 'v'],
  '^': ['<', '^', '>'],
  'v': ['>', 'v', '<'],
}

const turns = {
  '/': { '<': 'v', 'v': '<', '^': '>', '>': '^' },
  '\\': { '>': 'v', 'v': '>', '^': '<', '<': '^' },
}

const movements =
  { '>': [1, 0], 'v': [0, 1], '^': [0, -1], '<': [-1, 0] }

const movementDirections = Object.keys(movements)

const createCart = (direction, position) => ({
  name: position.join('-'),
  direction,
  position,
  crossed: 0,
  crashed: false,
})

const comparePosition = ({ position: [xa, ya] }, { position: [xb, yb] }) =>
  (ya - yb) || (xa - xb)

const readInput = () => {
  const rawGrid = common.readDayRows(13)
    .map(row => row.split(''))

  const tracks = rawGrid.map(row => row.map(char => railReplacements[char] || char))
  const carts = new Grid(rawGrid).reduce(
    (acc, char, position) => {
      if (!movementDirections.includes(char)) {
        return acc
      }

      return [...acc, createCart(char, position)]
    },
    [],
  ).sort(comparePosition)

  return { tracks, carts }
}

const input = readInput()

const applyMovement = (point, direction) =>
  add(point)(movements[direction])

const move = cart => {
  const { name, position: [x, y] } = cart
  let { direction, crossed } = cart

  const track = input.tracks[y][x]

  if (track === '+') {
    direction = crossings[direction][crossed % 3]
    crossed += 1
  } else if (turns[track]) {
    direction = turns[track][direction]
  }

  const position = applyMovement(cart.position, direction)

  return { name, direction, position, crossed }
}

const checkCrash = (previous, moved, cart) =>
  moved.find(c => comparePosition(c, cart) === 0)
  || previous.slice(moved.length).find(c => comparePosition(c, cart) === 0)

const moveAll = (start) => {
  let carts = []

  // Missing sort!
  start.forEach(cart => {
    if (cart.crashed) {
      carts.push(cart)
      return
    }

    const newCart = move(cart)
    const crash = checkCrash(start, carts, newCart)

    if (crash) {
      crash.crashed = true
      newCart.crashed = true
    }

    carts.push(newCart)
  })

  return {
    carts: carts.filter(c => !c.crashed),
    crashes: carts.filter(c => c.crashed),
  }
}

const findFirstCrash = carts => {
  let state = {
    carts,
    crashes: [],
  }

  while (true) {
    state = moveAll(state.carts)

    if (state.crashes.length > 0) {
      return state.crashes[0]
    }
  }
}

const firstCrash = findFirstCrash(input.carts)

const result1 = firstCrash.position.join(',')

console.log(result1) // 91,69


const moveUntilOneLeft = carts => {
  let state = {
    carts,
    crashes: [],
  }

  while (state.carts.length > 1) {
    state = moveAll(state.carts)
  }

  return state.carts[0]
}

const finalCart = moveUntilOneLeft(input.carts)

const result2 = finalCart.position.join(',')

console.log(result2) // 44,87
