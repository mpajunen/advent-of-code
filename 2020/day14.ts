import { Input, List, Num } from '../common'

type Instruction =
  | { kind: 'mask'; mask: string }
  | { kind: 'mem'; address: number, value: number }

type State1 = {
  registers: Record<number, number>
  andMask: bigint
  orMask: bigint
}

type State2 = {
  registers: Record<number, number>
  orMask: bigint
  floatingMask: bigint
}

const parseMem = Input.parseByPattern('mem[%i] = %i')

const getMem = ([address, value]: [number, number]): Instruction =>
  ({ kind: 'mem', address, value })

const read = (row: string): Instruction =>
  row.startsWith('mask') ? { kind: 'mask', mask: row.slice(7) } : getMem(parseMem(row) as any)

const step1 = (prev: State1, i: Instruction): State1 => {
  switch (i.kind) {
    case 'mask':
      return {
        ...prev,
        andMask: BigInt(parseInt(i.mask.replace(/X/g, '1'), 2)),
        orMask: BigInt(parseInt(i.mask.replace(/X/g, '0'), 2)),
      }
    case 'mem':
      const value = (BigInt(i.value) | prev.orMask) & prev.andMask
      const registers = { ...prev.registers, [i.address]: Number(value) }

      return { ...prev, registers }
  }
}

const BIT_COUNT = 36
const BITS = List.range(0, BIT_COUNT).map(bit => BigInt(2 ** bit))

const getAddresses = (base: bigint, mask: bigint): number[] =>
  BITS.map(bit => bit & mask)
    .filter(n => n > 0)
    .reduce((acc, bit) => acc.flatMap(v => [v | bit, v & (~bit)]), [base])
    .map(v => Number(v))

const step2 = (prev: State2, i: Instruction): State2 => {
  switch (i.kind) {
    case 'mask':
      return {
        ...prev,
        orMask: BigInt(parseInt(i.mask.replace(/X/g, '0'), 2)),
        floatingMask: BigInt(parseInt(
          i.mask.replace(/1/g, '0').replace(/X/g, '1'),
          2,
        )),
      }
    case 'mem':
      const registers = { ...prev.registers }
      const base = BigInt(i.address) | prev.orMask
      const addresses = getAddresses(base, prev.floatingMask)

      addresses.forEach(a => {
        registers[a] = i.value
      })

      return { ...prev, registers }
  }
}

export default (rows: string[]) => {
  const input = rows.map(read)

  const end1 = input.reduce(step1, { registers: {}, orMask: BigInt(0), andMask: BigInt(0) })

  const end2 = input.reduce(step2, { registers: {}, orMask: BigInt(0), floatingMask: BigInt(0) })

  const result1 = Num.sum(Object.values(end1.registers))
  const result2 = Num.sum(Object.values(end2.registers))

  return [result1, result2, 6559449933360, 3369767240513]
}
