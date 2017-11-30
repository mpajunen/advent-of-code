"use strict"

const fs = require('fs')
//const immutable = require('immutable')


const input = fs.readFileSync('input/day8.txt', 'utf8')


const strings = input
    .split('\n')


const getChar = hex => String.fromCharCode(parseInt(hex, 16))

const handleEscape = (next, remaining) =>
    ['"', '\\'].includes(next)
        ? next + splitString(remaining)
        : getChar(remaining.slice(0, 2)) + splitString(remaining.slice(2))

const handleSplitString = (start, remaining) => {
    if (start === '"') {
        return splitString(remaining)
    } else if (start === '\\') {
        return handleEscape(remaining.charAt(0), remaining.slice(1))
    } else {
        return start + splitString(remaining)
    }
}

const splitString = string =>
    string === '' ? '' : handleSplitString(string.charAt(0), string.slice(1))

const contents = strings
    .map(splitString)

const getTotalLength = rows => rows
    .reduce((sum, str) => sum + str.length, 0)

const result1 = getTotalLength(strings) - getTotalLength(contents)

console.log(result1)


const encodeChar = char =>
    ['"', '\\'].includes(char) ? '\\' + char : char

const encodeStringContent = str => str
    .split('')
    .map(encodeChar)
    .join('')

const encodeString = str =>
    '"' + encodeStringContent(str) + '"'

const encoded = strings
    .map(encodeString)

const result2 = getTotalLength(encoded) - getTotalLength(strings)

console.log(encoded)

console.log(result2)
