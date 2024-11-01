import { List, Num } from '../common'

const propertyNames = [
  'capacity',
  'durability',
  'flavor',
  'texture',
  'calories',
] as const
type Property = (typeof propertyNames)[number]

type Properties = Record<Property, number>
type Ingredient = { name: string } & Properties

const TOTAL_COUNT = 100

const emptyProperties = Object.fromEntries(
  propertyNames.map(name => [name, 0]),
) as Properties

const getIngredient = (row: string): Ingredient => {
  const [name, rest] = row.split(': ')
  const properties = Object.fromEntries(
    rest
      .split(', ')
      .map(f => f.split(' '))
      .map(f => [f[0], parseInt(f[1])]),
  ) as Properties

  return { name, ...properties }
}

const addIngredient = (
  recipe: Properties,
  ingredient: Ingredient,
  count: number,
): Properties => {
  const result = { ...recipe }

  for (const name of propertyNames) {
    result[name] += ingredient[name] * count
  }

  return result
}

const scoreProperties = propertyNames.filter(name => name !== 'calories')

const score = (recipe: Properties): number =>
  Num.product(scoreProperties.map(name => Math.max(recipe[name], 0)))

const findHighestScore = (
  ingredients: Ingredient[],
  calorieCount: number = 0,
  recipe: Properties = emptyProperties,
  countLeft: number = TOTAL_COUNT,
): number => {
  const [ingredient, ...rest] = ingredients

  if (rest.length === 0) {
    const newRecipe = addIngredient(recipe, ingredient, countLeft)

    if (calorieCount > 0 && newRecipe.calories !== calorieCount) {
      return 0
    }

    return score(addIngredient(recipe, ingredient, countLeft))
  }

  const options = List.range(0, countLeft).map(count => {
    const newRecipe = addIngredient(recipe, ingredient, count)

    return findHighestScore(rest, calorieCount, newRecipe, countLeft - count)
  })

  return Math.max(...options)
}

export default (rows: string[]) => {
  const ingredients = rows.map(getIngredient)

  const result1 = findHighestScore(ingredients)
  const result2 = findHighestScore(ingredients, 500)

  return [result1, result2, 18965440, 15862900]
}
