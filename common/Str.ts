import * as List from './List'

export const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')

export const charCounts = (s: string): Record<string, number> => List.counts(s.split(''))

export const chunk = (chunkLength: number, s: string): string[] =>
  List.range(0, s.length, chunkLength).map(i => s.slice(i, i + chunkLength))

export const replaceAll = (str: string, search: string, replacement: string) =>
  str.replace(new RegExp(search, 'g'), replacement)
