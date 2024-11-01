import * as common from './common'
import { run } from './WristDevice'

const readInput = () => {
  const raw = common.readDayRows(21)

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

const input = readInput()

/*
17	seti	0		1			R1 = 0

18	addi	1	1	4			R4 = R1 + 1
19	muli	4	256	4			R4 = R4 * 256
20	gtrr	4	3	4			R4 > R3
21	addr	4	2	2		Jump, prev
22	addi	2	1	2		Jump
23	seti	25		2		Jump forward
24	addi	1	1	1			R1 += 1
25	seti	17		2		Loop back 17

26	setr	1		3			R3 = R1
*/
const innerLoop = r => {
  r[1] = Math.floor(r[3] / 256)
  r[3] = r[1]
  r[2] = 26

  return r
}

/*
9	addr	5	1	5
10	bani	5	16777215	5
11	muli	5	65899	5
12	bani	5	16777215	5
 */
const changeFive = r => ((r[5] + (r[3] & 255)) * 65899) & 16777215 // 65793 * 255

/*
7	seti	9010242		5

8	bani	3	255	1

-- changeFive

13	gtir	256	3	1			256 > R3
14	addr	1	2	2		Jump, prev
15	addi	2	1	2		Jump
16	seti	27		2		Jump forward

-- innerLoop
 */
const outerLoop = r => {
  r[3] = r[5] | 65536
  r[5] = 9010242
  r[5] = changeFive(r)

  while (r[3] >= 256) {
    r[3] = Math.floor(r[3] / 256)
    r[5] = changeFive(r)
  }

  r[2] = 28

  return r
}

const runProgram = (
  { ip, instructions },
  limit,
  start0 = 0,
  optimize = false,
) => {
  const startIp = 6
  let registers = [start0, 0, startIp, 0, 0, 0]
  let i = 0

  const found = new Set()
  const foundAt = []

  while (registers[ip] < instructions.length) {
    registers =
      optimize && registers[ip] === 6
        ? outerLoop(registers)
        : run(ip, instructions, registers)

    i += 1

    if (registers[ip] === 28 && !found.has(registers[5])) {
      found.add(registers[5])
      foundAt.push(i)
    }

    if (i >= limit) {
      break
    }
  }

  const values = [...found.values()]

  return {
    i,
    registers,
    first: values[0],
    firstAt: foundAt[0],
    last: values[found.size - 1],
    lastAt: foundAt[foundAt.length - 1],
    count: values.length,
  }
}

const INSTRUCTION_LIMIT = 200000 // Determined empirically

const result = runProgram(input, INSTRUCTION_LIMIT, 0, true)

const result1 = result.first

console.log(result1) // 6619857

const result2 = result.last

console.log(result2) // 9547924
