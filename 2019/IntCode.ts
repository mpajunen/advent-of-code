const OPERATION = {
  ADD: 1,
  MUL: 2,
  EXIT: 99,
}

export const run = (initial: number[]): number[] => {
  const codes = [...initial]
  let instructionPointer = 0

  while (true) {
    const operation = codes[instructionPointer]
    if (operation === OPERATION.EXIT) {
      return codes
    }

    const left = codes[instructionPointer + 1]
    const right = codes[instructionPointer + 2]
    const target = codes[instructionPointer + 3]

    if (operation === OPERATION.ADD) {
      codes[target] = codes[left] + codes[right]
    } else if (operation === OPERATION.MUL) {
      codes[target] = codes[left] * codes[right]
    } else {
      throw Error(`Invalid operation ${operation}.`)
    }

    instructionPointer += 4
  }
}

export const runWithInit = (codes: number[], noun: number, verb: number) => {
  const copy = [...codes]
  copy[1] = noun
  copy[2] = verb

  return run(copy)
}
