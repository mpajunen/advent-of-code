"use strict"

const R = require('ramda')

//const input = '1'
//const iterations = 5

const iterations = 50
const input = '1113222113'

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

const result1 = R.range(0, iterations)
    .reduce(lookAndSay, input)
    .length

console.log(result1)


