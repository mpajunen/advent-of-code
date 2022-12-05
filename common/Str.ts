import * as List from './List'

export const alphabet = 'abcdefghijklmnopqrstuvwxyz'

export const charCount = (char: string, text: string): number => text.split(char).length - 1

export const charCounts = (s: string): Record<string, number> => List.counts(s.split(''))

export const chunk = (chunkLength: number, s: string): string[] =>
  List.range(0, s.length, chunkLength).map(i => s.slice(i, i + chunkLength))

export const commonChars = (...strings: string[]): string =>
  List.intersectionOf(strings.map(s => s.split(''))).join('')

export const map = (transform: (value: string) => number | string, str: string): string =>
  str.split('').map(transform).join('')

export const replaceAll = (str: string, search: string, replacement: string) =>
  str.replace(new RegExp(search, 'g'), replacement)

export const reverse = (s: string) => s.split('').reverse().join('')

export const sort = (s: string) => s.split('').sort().join('')

export const splitAt = (s: string, index: number) => [s.slice(0, index), s.slice(index)]

export const splitIn = (s: string, chunkCount: number) => chunk(s.length / chunkCount, s)

export const words = (s: string) => s.split(' ').filter(w => w !== '')
