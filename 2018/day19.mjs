import * as common from './common'
import { run } from './WristDevice'

const readInput = () => {
  const raw = common.readDayRows(19)

  const [ipRow, ...rest] = raw
  const instructions = rest.map(row => {
    const [name, ...nums] = row.split(' ')

    return [name, ...nums.map(n => parseInt(n, 10))]
  })

  return {
    ip: parseInt(ipRow.split(' ')[1], 10),
    instructions,
  }
}

const runProgram = ({ ip, instructions }, start0 = 0, optimize = false) => {
  let registers = [start0, 0, 0, 0, 0, 0]

  while (registers[ip] < instructions.length) {
    if (optimize && registers[ip] === 1) {
      return common.sum(common.findFactors(registers[1]))
    }

    registers = run(ip, instructions, registers)
  }

  return registers[0]
}

const input = readInput()

const result1 = runProgram(input, 0, true)

console.log(result1) // 984


const result2 = runProgram(input, 1, true)

console.log(result2) // 10982400
