'use strict'

export default ([braces]) => {
  var upCount = braces.split('(').length - 1
  var downCount = braces.split(')').length - 1

  const braceArray = braces.split('')

  const position =
    -braceArray
      .map(value => (value === '(' ? 1 : -1))
      .reduce(
        (acc, value, index) =>
          acc < 0 ? acc : acc === 0 && value === -1 ? -index : acc + value,
        0,
      ) + 1

  return [upCount - downCount, position, 232, 1783]
}
