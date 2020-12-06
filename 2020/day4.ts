import { List } from '../common'

const getPassports = (rows: string[]) => {
  const all = List.splitBy(row => row === '', rows)

  return all
    .map(p => p.flatMap(row => row.split(' ')))
    .map(p => Object.fromEntries(p.map(field => field.split(':'))))
}

const isValid1 = (passport: Record<string, string>) =>
  Object.keys(passport).length === 8 ||
  (Object.keys(passport).length === 7 && passport.cid === undefined)

const isValid2 = ({ byr, iyr, eyr, hgt, hcl, ecl, pid }: Record<string, string>) => {
  const birth = Number(byr)
  const issued = Number(iyr)
  const expire = Number(eyr)
  const [height, heightUnit] = hgt?.endsWith('in')
    ? [Number(hgt?.slice(0, -2)), 'in']
    : [Number(hgt?.slice(0, -2)), 'cm']
  const isColor = hcl?.match(/^#[\dabcdef]{6}$/)
  const isPid = pid?.match(/^\d{9}$/)

  return (birth >= 1920 && birth <= 2002)
    && (issued >= 2010 && issued <= 2020)
    && (expire >= 2020 && expire <= 2030)
    && (
      (heightUnit === 'in' && List.isSorted([59, height, 76]))
      || (heightUnit === 'cm' && List.isSorted([150, height, 193]))
    )
    && isColor
    && ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(ecl)
    && isPid
}

export default (rows: string[]) => {
  const passports = getPassports(rows)

  const result1 = passports.filter(isValid1).length
  const result2 = passports.filter(isValid2).length

  return [result1, result2, 190, 121]
}
