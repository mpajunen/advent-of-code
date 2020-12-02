import * as common from '../common/common'
import * as IntCode from './IntCode'

const findOutput = (codes: number[]) => {
  for (const noun of common.range(0, 99)) {
    for (const verb of common.range(0, 99)) {
      const [output] = IntCode.runWithInit(codes, noun, verb)
      if (output === 19690720) {
        return 100 * noun + verb
      }
    }
  }
}

export default function day2([row]: string[]): [unknown, unknown] {
  const codes = row.split(',').map(row => parseInt(row))

  const [result1] = IntCode.runWithInit(codes, 12, 2)

  return [
    result1, // 4138687
    findOutput(codes) // 6635
  ]
}
