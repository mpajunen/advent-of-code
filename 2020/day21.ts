import { List } from '../common'

type Food = {
  ingredients: string[]
  allergens: string[]
}

type Option = [allergen: string, ingredients: string[]]
type Cause = [allergen: string, ingredient: string]

const getFood = (row: string): Food => {
  const [start, end] = row.slice(0, -1).split(' (contains ')

  return { ingredients: start.split(' '), allergens: end.split(', ') }
}

const findCauses = ([first, ...rest]: Option[]): Cause[] => {
  const [allergen, [ingredient]] = first
  const result: Cause = [allergen, ingredient]
  if (rest.length === 0) {
    return [result]
  }
  const remaining: Option[] = rest
    .map(([a, ingredients]) => [a, ingredients.filter(i => i !== ingredient)])

  return [result, ...findCauses(List.sortBy(o => o[1].length, remaining))]
}

const findAllergens = (foods: Food[]): Cause[] => {
  const allergens = List.unique(foods.flatMap(f => f.allergens))
  const foundIn: Option[] = allergens.map(a => [a, List.intersectionOf(
    foods.filter(f => f.allergens.includes(a)).map(f => f.ingredients),
  )])

  return findCauses(foundIn)
}

export default (rows: string[]) => {
  const foods = rows.map(getFood)

  const causes = findAllergens(foods)
  const dangerous = causes.map(([, ingredient]) => ingredient)
  const nonCauses = foods
    .flatMap(f => f.ingredients)
    .filter(i => !dangerous.includes(i))

  const canonical = List.sortBy(([allergen]) => allergen, causes)
    .map(([, ingredient]) => ingredient)

  const result1 = nonCauses.length
  const result2 = canonical.join(',')

  return [result1, result2, 2230, 'qqskn,ccvnlbp,tcm,jnqcd,qjqb,xjqd,xhzr,cjxv']
}
