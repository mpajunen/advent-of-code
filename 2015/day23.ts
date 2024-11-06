type Register = 'a' | 'b'
type Instruction =
  | { type: 'hlf'; register: Register }
  | { type: 'tpl'; register: Register }
  | { type: 'inc'; register: Register }
  | { type: 'jmp'; offset: number }
  | { type: 'jie'; register: Register; offset: number }
  | { type: 'jio'; register: Register; offset: number }

type State = { a: number; b: number; ip: number }

const parseInstruction = (row: string): Instruction => {
  const [type, ...rest] = row.split(' ')

  switch (type) {
    case 'hlf':
    case 'tpl':
    case 'inc':
      return { type, register: rest[0] as Register }
    case 'jmp':
      return { type, offset: parseInt(rest[0]) }
    case 'jie':
    case 'jio':
      return {
        type,
        register: rest[0][0] as Register,
        offset: parseInt(rest[1]),
      }
    default:
      throw new Error(`Unknown instruction: ${type}`)
  }
}

const applyInstruction = (state: State, instr: Instruction) => {
  switch (instr.type) {
    case 'hlf':
      state[instr.register] /= 2
      state.ip++
      break
    case 'tpl':
      state[instr.register] *= 3
      state.ip++
      break
    case 'inc':
      state[instr.register]++
      state.ip++
      break
    case 'jmp':
      state.ip += instr.offset
      break
    case 'jie':
      state.ip += state[instr.register] % 2 === 0 ? instr.offset : 1
      break
    case 'jio':
      state.ip += state[instr.register] === 1 ? instr.offset : 1
      break
  }
}

const run = (instructions: Instruction[], state: State): State => {
  while (state.ip < instructions.length) {
    applyInstruction(state, instructions[state.ip])
  }

  return state
}

export default (rows: string[]) => {
  const instructions = rows.map(parseInstruction)

  const result1 = run(instructions, { a: 0, b: 0, ip: 0 }).b
  const result2 = run(instructions, { a: 1, b: 0, ip: 0 }).b

  return [result1, result2, 255, undefined]
}
