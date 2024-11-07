import * as common from './common'
import { run } from './WristDevice'

const readInput = raw => {
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

export default rows => {
  const input = readInput(rows)

  const result1 = runProgram(input, 0, true)
  const result2 = runProgram(input, 1, true)

  return [result1, result2, 984, 10982400]
}
