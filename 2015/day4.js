'use strict'

const crypto = require('crypto')

const md5 = input => crypto.createHash('md5').update(input).digest('hex')

const findMd5WithPrefix = (input, prefix) => {
  const len = prefix.length

  let i = 0
  let result

  while (true) {
    i++
    result = md5(input + i)

    if (result.substring(0, len) === prefix) {
      break
    }
  }

  return i
}

export default ([input]) => {
  const result1 = findMd5WithPrefix(input, '00000')
  const result2 = findMd5WithPrefix(input, '000000')

  return [result1, result2, 282749, 9962624]
}
