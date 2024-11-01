import { List } from '../common'
import * as IntCode from './IntCode'

const findOutput = (codes: number[]) => {
  for (const noun of List.range(0, 99)) {
    for (const verb of List.range(0, 99)) {
      const [output] = IntCode.runWithInit(codes, noun, verb)
      if (output === 19690720) {
        return 100 * noun + verb
      }
    }
  }
}

export default ([row]: string[]) => {
  const codes = row.split(',').map(row => parseInt(row))

  const [result1] = IntCode.runWithInit(codes, 12, 2)

  return [result1, findOutput(codes), 4138687, 6635]
}
