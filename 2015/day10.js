'use strict'

const fs = require('fs')
const R = require('ramda')

const iterations = 50
const input = fs.readFileSync('input/day10.txt', 'utf8').trim()

const lookAndSay = str => {
  let result = ''
  let count = 0
  let current = null

  for (let i = 0; i < str.length; i++) {
    if (str.charAt(i) === current) {
      count += 1
    } else {
      if (count > 0) {
        result += `${count}${current}`
      }

      current = str.charAt(i)
      count = 1
    }
  }

  result += `${count}${current}`

  return result
}

const result1 = R.range(0, iterations).reduce(lookAndSay, input).length

console.log(result1)
