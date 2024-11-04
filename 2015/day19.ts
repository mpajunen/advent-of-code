import { List } from '../common'

type Replacement = [from: string, to: string]

const getInput = (rows: string[]) => {
  const [replacements_, [molecule]] = List.splitBy(r => r === '', rows)

  const replacements = replacements_.map(r => r.split(' => ') as Replacement)

  return { replacements, molecule }
}

const replaceAll = (molecule: string, [from, to]: Replacement) =>
  List.range(0, molecule.length)
    .filter(i => molecule.slice(i, i + from.length) === from)
    .map(i => `${molecule.slice(0, i)}${to}${molecule.slice(i + from.length)}`)

const makeReplacements = (molecule: string, replacements: Replacement[]) =>
  replacements.flatMap(r => replaceAll(molecule, r))

const findFewestSteps = (molecule: string, replacements: Replacement[]) => {
  const find = (current: string, iterations = 0): number => {
    if (current === 'e') {
      return iterations
    }

    // The replacement rules are such that any order of valid replacements
    // will produce the same iteration count. This is not guaranteed in general.
    const [option] = makeReplacements(current, replacements)

    return find(option, iterations + 1)
  }

  return find(molecule)
}

export default (rows: string[]) => {
  const { molecule, replacements } = getInput(rows)

  const result1 = List.unique(makeReplacements(molecule, replacements)).length
  const result2 = findFewestSteps(
    molecule,
    replacements.map(r => [r[1], r[0]]),
  )

  return [result1, result2, 518, 200]
}
