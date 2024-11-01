import { isNumeric } from './Num'
import { replaceAll } from './Str'

export const parseByPattern = <Result extends (number | string)[]>(
  rawPattern: string,
) => {
  const pattern = replaceRules.reduce(
    (p, [from, to]) => replaceAll(p, from, to),
    rawPattern,
  )
  const regex = new RegExp(pattern)

  return (value: string) =>
    regex.exec(value)?.slice(1).map(parseValue) as Result
}

const parseValue = (value: string): number | string =>
  isNumeric(value) ? parseFloat(value) : value

const replaceRules = [
  ['%i', '[\\s]*(-?\\d+)'],
  ['%w', '[\\s]*([\\w ]+)'],
]
