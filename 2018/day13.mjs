import Grid, { add } from './Grid'

const railReplacements = { '<': '-', '>': '-', '^': '|', v: '|' }

const crossings = {
  '<': ['v', '<', '^'],
  '>': ['^', '>', 'v'],
  '^': ['<', '^', '>'],
  v: ['>', 'v', '<'],
}

const turns = {
  '/': { '<': 'v', v: '<', '^': '>', '>': '^' },
  '\\': { '>': 'v', v: '>', '^': '<', '<': '^' },
}

const movements = { '>': [1, 0], v: [0, 1], '^': [0, -1], '<': [-1, 0] }

const movementDirections = Object.keys(movements)

const createCart = (direction, position) => ({
  name: position.join('-'),
  direction,
  position,
  crossed: 0,
  crashed: false,
})

const comparePosition = ({ position: [xa, ya] }, { position: [xb, yb] }) =>
  ya - yb || xa - xb

const readInput = rows => {
  const rawGrid = rows.map(row => row.split(''))

  const tracks = rawGrid.map(row =>
    row.map(char => railReplacements[char] || char),
  )
  const carts = new Grid(rawGrid)
    .reduce((acc, char, position) => {
      if (!movementDirections.includes(char)) {
        return acc
      }

      return [...acc, createCart(char, position)]
    }, [])
    .sort(comparePosition)

  return { tracks, carts }
}

const applyMovement = (point, direction) => add(point)(movements[direction])

const move = (input, cart) => {
  const {
    name,
    position: [x, y],
  } = cart
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
  moved.find(c => comparePosition(c, cart) === 0) ||
  previous.slice(moved.length).find(c => comparePosition(c, cart) === 0)

const moveAll = (input, start) => {
  let carts = []

  // Missing sort!
  start.forEach(cart => {
    if (cart.crashed) {
      carts.push(cart)
      return
    }

    const newCart = move(input, cart)
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

const findFirstCrash = (input, carts) => {
  let state = {
    carts,
    crashes: [],
  }

  while (true) {
    state = moveAll(input, state.carts)

    if (state.crashes.length > 0) {
      return state.crashes[0]
    }
  }
}

const moveUntilOneLeft = (input, carts) => {
  let state = {
    carts,
    crashes: [],
  }

  while (state.carts.length > 1) {
    state = moveAll(input, state.carts)
  }

  return state.carts[0]
}

export default rows => {
  const input = readInput(rows)

  const firstCrash = findFirstCrash(input, input.carts)
  const finalCart = moveUntilOneLeft(input, input.carts)

  const result1 = firstCrash.position.join(',')
  const result2 = finalCart.position.join(',')

  return [result1, result2, '91,69', '44,87']
}
