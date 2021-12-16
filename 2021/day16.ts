import { List, Num } from '../common'

type Bit = 0 | 1

const toBits = (num: number): Bit[] => [num & 8, num & 4, num & 2, num & 1].map(v => v ? 1 : 0)

const fromBits = (bits: Bit[]): number => parseInt(bits.join(''), 2)

const getInput = ([row]: string[]) =>
  row.split('').map(v => parseInt(v, 16)).flatMap(toBits)

const readPackets = (bits: Bit[]) => {
  let index = 0

  const consume = (length: number) => {
    const result = bits.slice(index, index + length)
    index += length
    return result
  }

  const readPacket = (): Packet => {
    const version = fromBits(consume(3))
    const typeId = fromBits(consume(3)) as Packet['typeId']

    if (typeId === 4) {
      const chunks = []
      while (true) {
        const [groupBit, ...dataBits] = consume(5)
        chunks.push(dataBits)
        if (groupBit === 0) {
          break
        }
      }
      const literal = fromBits(chunks.flat())

      return { version, typeId, literal }
    } else {
      const [lengthTypeId] = consume(1)
      const size = fromBits(consume(lengthTypeId === 0 ? 15 : 11))
      const subPackets = lengthTypeId === 0
        ? readPackets(consume(size))
        : List.range(0, size).map(readPacket)

      return { version, typeId, subPackets }
    }
  }

  const packets = []
  while (index < bits.length) {
    packets.push(readPacket())
  }
  return packets
}

type OperatorId = 0 | 1 | 2 | 3 | 5 | 6 | 7
type Packet = { version: number } & ({ typeId: 4, literal: number } | { typeId: OperatorId, subPackets: Packet[] })

const sumVersions = (p: Packet): number =>
  p.version + (p.typeId === 4 ? 0 : Num.sum(p.subPackets.map(sumVersions)))

const operators: Record<OperatorId, (values: number[]) => number> = {
  0: Num.sum,
  1: Num.product,
  2: values => Math.min(...values),
  3: values => Math.max(...values),
  5: ([a, b]) => a > b ? 1 : 0,
  6: ([a, b]) => a < b ? 1 : 0,
  7: ([a, b]) => a === b ? 1 : 0,
}

const calculate = (p: Packet): number =>
  p.typeId === 4 ? p.literal : operators[p.typeId](p.subPackets.map(calculate))

export default (rows: string[]) => {
  const input = getInput(rows)
  const [rootPacket] = readPackets(input)

  const result1 = sumVersions(rootPacket)
  const result2 = calculate(rootPacket)

  return [result1, result2, 879, 539051801941]
}
