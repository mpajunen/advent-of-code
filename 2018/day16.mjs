import { instruct, operations } from './WristDevice'

const getPosition = row =>
  row
    .slice(9, 19)
    .split(', ')
    .map(n => parseInt(n, 10))

const getInstruction = row => row.split(' ').map(n => parseInt(n, 10))

const readInput = raw => {
  /*
Before: [2, 3, 2, 2]
0 3 3 0
After:  [0, 3, 2, 2]
  */
  let rowNumber = 0

  const examples = []
  while (raw[rowNumber].startsWith('Before')) {
    examples.push({
      before: getPosition(raw[rowNumber]),
      instruction: getInstruction(raw[rowNumber + 1]),
      after: getPosition(raw[rowNumber + 2]),
    })

    rowNumber += 3
  }

  const program = []
  while (raw[rowNumber]) {
    program.push(getInstruction(raw[rowNumber]))
    rowNumber += 1
  }

  return { examples, program }
}

const exampleMatches = example => func =>
  instruct(func, example.instruction, example.before).every(
    (r, index) => r === example.after[index],
  )

const MULTI_BEHAVIOR_LIMIT = 3

const isMultiMatch = example =>
  Object.values(operations).filter(exampleMatches(example)).length >=
  MULTI_BEHAVIOR_LIMIT

const findPossible = (example, key) => {
  const ops = Object.entries(operations)
    .filter(([op, func]) => exampleMatches(example)(func))
    .map(([op]) => op)

  return { key, num: example.instruction[0], ops }
}

const findOpcodes = examples => {
  const possibilities = examples.map(findPossible)

  const found = []
  const isAvailable = op => !found.includes(op)
  const opcodes = new Map()

  while (true) {
    const candidate = possibilities.find(
      p => !opcodes.has(p.num) && p.ops.filter(isAvailable).length === 1,
    )
    if (!candidate) {
      break
    }

    const op = candidate.ops.find(isAvailable)

    found.push(op)
    opcodes.set(candidate.num, op)
  }

  return opcodes
}

export default rows => {
  const input = readInput(rows.filter(row => !!row))

  const opcodes = findOpcodes(input.examples)

  const run = (registers, instruction) =>
    instruct(operations[opcodes.get(instruction[0])], instruction, registers)

  const runProgram = (program, initialRegisters = [0, 0, 0, 0]) =>
    program.reduce(run, initialRegisters)

  const result1 = input.examples.filter(isMultiMatch).length
  const result2 = runProgram(input.program)[0]

  return [result1, result2, 605, 653]
}
