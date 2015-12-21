"use strict";

const fs = require('fs');


const braces = fs.readFileSync('input/day1.txt', 'utf8');

var upCount = braces.split("(").length - 1;
var downCount = braces.split(")").length - 1;

console.log(upCount - downCount);


const braceArray = braces.split("");

const position = -braceArray
    .map(value => value === "(" ? 1 : -1)
    .reduce((acc, value, index) => acc < 0 ? acc : (acc === 0 && value === -1 ? -index : acc + value), 0)
    + 1;

console.log(position);
