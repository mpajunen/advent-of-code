const input = 320851

const START_RECIPES = [3, 7]
const START_POSITIONS = [0, 1]
const NEXT_COUNT = 10

const getInitialState = () => ({
  recipes: [...START_RECIPES],
  positions: [...START_POSITIONS],
})

const addNew = (recipes, [first, second]) => {
  const value = recipes[first] + recipes[second]

  if (value >= 10) {
    recipes.push(1)
  }
  recipes.push(value % 10)
}

const step = state => {
  addNew(state.recipes, state.positions)

  state.positions = state.positions.map(
    p => (p + 1 + state.recipes[p]) % state.recipes.length,
  )
}

const process1 = trainingLength => {
  const state = getInitialState()

  while (state.recipes.length < trainingLength + NEXT_COUNT) {
    step(state)
  }

  return state.recipes.slice(state.recipes.length - 10).join('')
}

const result1 = process1(input)

console.log(result1) // 7116398711

const process2 = searchValue => {
  const state = getInitialState()
  const OFFSET = searchValue.length

  while (true) {
    step(state)

    const testValue = state.recipes
      .slice(state.recipes.length - OFFSET - 1)
      .join('')

    if (testValue.startsWith(searchValue)) {
      return state.recipes.length - OFFSET - 1
    }
    if (testValue.endsWith(searchValue)) {
      return state.recipes.length - OFFSET
    }
  }
}

const result2 = process2(input.toString())

console.log(result2) // 20316365
