export const operations = {
  addr: ([, A, B], reg) => reg[A] + reg[B],
  addi: ([, A, B], reg) => reg[A] + B,
  mulr: ([, A, B], reg) => reg[A] * reg[B],
  muli: ([, A, B], reg) => reg[A] * B,
  banr: ([, A, B], reg) => reg[A] & reg[B],
  bani: ([, A, B], reg) => reg[A] & B,
  borr: ([, A, B], reg) => reg[A] | reg[B],
  bori: ([, A, B], reg) => reg[A] | B,
  setr: ([, A], reg) => reg[A],
  seti: ([, A]) => A,
  gtir: ([, A, B], reg) => A > reg[B] ? 1 : 0,
  gtri: ([, A, B], reg) => reg[A] > B ? 1 : 0,
  gtrr: ([, A, B], reg) => reg[A] > reg[B] ? 1 : 0,
  eqir: ([, A, B], reg) => A === reg[B] ? 1 : 0,
  eqri: ([, A, B], reg) => reg[A] === B ? 1 : 0,
  eqrr: ([, A, B], reg) => reg[A] === reg[B] ? 1 : 0,
}

export const instruct = (func, instruction, registers) => {
  const [, , , C] = instruction
  const result = [...registers]
  result[C] = func(instruction, registers)

  return result
}

export const run = (ip, instructions, registers) => {
  const instruction = instructions[registers[ip]]
  const operation = operations[instruction[0]]

  registers = instruct(operation, instruction, registers)
  registers[ip] += 1

  return registers
}
