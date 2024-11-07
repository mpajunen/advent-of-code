import { Grid, Input, Num, List, Str, Vec2 } from '../common'

type Operation = 'acc' | 'jmp' | 'nop'
type Instruction = { operation: Operation; argument: number }

type State = { index: number; acc: number }

type Run = (state: State, instruction: Instruction) => State

const executors: Record<Operation, Run> = {
  acc: ({ acc, index }, { argument }) => ({
    acc: acc + argument,
    index: index + 1,
  }),
  jmp: ({ acc, index }, { argument }) => ({ acc, index: index + argument }),
  nop: ({ acc, index }) => ({ acc, index: index + 1 }),
}

const getInstruction = ([operation, argument]: string[]) =>
  ({ operation, argument: parseInt(argument) }) as Instruction

const run = (instructions: Instruction[]) => {
  let state = { index: 0, acc: 0 }
  const ran = []

  while (true) {
    const instruction = instructions[state.index]
    state = executors[instruction.operation](state, instruction)

    if (state.index >= instructions.length) {
      return ['terminate', state.acc]
    }
    if (ran.includes(state.index)) {
      return ['loop', state.acc]
    }
    ran.push(state.index)
  }
}

const conversion: Record<Operation, Operation> = {
  acc: 'acc',
  jmp: 'nop',
  nop: 'jmp',
}

const tryFixes = (instructions: Instruction[]) =>
  instructions.flatMap(({ operation, argument }, index) => {
    const fixed = [...instructions]
    fixed[index] = { operation: conversion[operation], argument }
    const [a, b] = run(fixed)

    return a === 'terminate' ? b : []
  })

export default (rows: string[]) => {
  const instructions = rows.map(r => getInstruction(r.split(' ')))

  const [, result1] = run(instructions)
  const [result2] = tryFixes(instructions)

  return [result1, result2, 1420, 1245]
}
