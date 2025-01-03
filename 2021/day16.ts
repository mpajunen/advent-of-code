import { List, Num } from '../common'

const toBits = (num: number): Num.Bit[] =>
  [num & 8, num & 4, num & 2, num & 1].map(v => (v ? 1 : 0))

const getInput = ([row]: string[]) =>
  row
    .split('')
    .map(v => parseInt(v, 16))
    .flatMap(toBits)

const readPackets = (bits: Num.Bit[]): Packet[] => {
  let index = 0

  const consume = (length: number) => {
    const result = bits.slice(index, index + length)
    index += length
    return result
  }
  const readInt = (length: number) => Num.fromBits(consume(length))

  const readLiteral = () => {
    const chunks = []
    while (true) {
      const [groupBit, ...dataBits] = consume(5)
      chunks.push(dataBits)
      if (groupBit === 0) {
        break
      }
    }

    return Num.fromBits(chunks.flat())
  }

  const readOperands = () =>
    readInt(1) === 0
      ? readPackets(consume(readInt(15)))
      : List.range(0, readInt(11)).map(readPacket)

  const readPacket = (): Packet => {
    const version = readInt(3)
    const typeId = readInt(3) as Packet['typeId']

    return typeId === 4
      ? { version, typeId, literal: readLiteral() }
      : { version, typeId, operands: readOperands() }
  }

  const packets = []
  while (index < bits.length) {
    packets.push(readPacket())
  }
  return packets
}

type OperatorId = 0 | 1 | 2 | 3 | 5 | 6 | 7
type Packet = { version: number } & (
  | { typeId: 4; literal: number }
  | { typeId: OperatorId; operands: Packet[] }
)

const sumVersions = (p: Packet): number =>
  p.version + (p.typeId === 4 ? 0 : Num.sum(p.operands.map(sumVersions)))

const operators: Record<OperatorId, (values: number[]) => number> = {
  0: Num.sum,
  1: Num.product,
  2: values => Math.min(...values),
  3: values => Math.max(...values),
  5: ([a, b]) => (a > b ? 1 : 0),
  6: ([a, b]) => (a < b ? 1 : 0),
  7: ([a, b]) => (a === b ? 1 : 0),
}

const calculate = (p: Packet): number =>
  p.typeId === 4 ? p.literal : operators[p.typeId](p.operands.map(calculate))

export default (rows: string[]) => {
  const input = getInput(rows)
  const [rootPacket] = readPackets(input)

  const result1 = sumVersions(rootPacket)
  const result2 = calculate(rootPacket)

  return [result1, result2, 879, 539051801941]
}
