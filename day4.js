"use strict"

const md5 = require('js-md5')

const input = 'ckczppom'

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


const result1 = findMd5WithPrefix(input, '00000')

console.log(result1)


const result2 = findMd5WithPrefix(input, '000000')

console.log(result2)
