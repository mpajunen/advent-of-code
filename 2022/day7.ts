import { List, Num } from '../common'

type Command =
  | { command: 'ls'; output: LsOutput[] }
  | { command: 'cd'; dir: string }

type LsOutput =
  | { type: 'dir'; name: string }
  | { type: 'file'; name: string; size: number }

type DirSizes = Record<string, number>

const parseCommand = ([commandRow, ...outputRows]: string[]): Command => {
  const [, command, arg] = commandRow.split(' ')

  switch (command) {
    case 'cd':
      return { command, dir: arg }
    case 'ls':
      return { command, output: outputRows.map(parseOutput) }
  }
}

const parseOutput = (row: string): LsOutput => {
  const parts = row.split(' ')

  return parts[0] === 'dir'
    ? { type: 'dir', name: parts[1] }
    : { type: 'file', name: parts[1], size: Number(parts[0]) }
}

const getInput = (rows: string[]) =>
  List.splitBy(row => row.startsWith('$'), rows, true)
    .slice(1) // Remove empty
    .map(parseCommand)

const getDirDirectSize = (out: LsOutput[]) =>
  Num.sum(out.map(o => (o.type === 'file' ? o.size : 0)))

const getDirDirectSizes = (commands: Command[]): DirSizes => {
  const dirSizes = {}
  let currentDir = []

  const changeDir = (dir: string) => {
    if (dir === '/') {
      currentDir = []
    } else if (dir === '..') {
      currentDir.pop()
    } else {
      currentDir.push(dir)
    }
  }

  commands.forEach(c => {
    if (c.command === 'cd') {
      changeDir(c.dir)
    } else {
      dirSizes[currentDir.join('/')] = getDirDirectSize(c.output)
    }
  })

  return dirSizes
}

const getTotalSizes = (ownSizes: DirSizes): DirSizes => {
  const sizes = Object.entries(ownSizes)

  const getTotalSize = (parentDir: string) =>
    Num.sum(sizes.map(([dir, size]) => (dir.startsWith(parentDir) ? size : 0)))

  return Object.fromEntries(sizes.map(([dir]) => [dir, getTotalSize(dir)]))
}

const SMALL_DIR_LIMIT = 100_000

const DISK_SIZE = 70_000_000
const REQUIRED_SPACE = 30_000_000

const getNeededSpace = (used: number) => REQUIRED_SPACE - (DISK_SIZE - used)

export default (rows: string[]) => {
  const input = getInput(rows)

  const dirSizes = getTotalSizes(getDirDirectSizes(input))
  const neededSpace = getNeededSpace(dirSizes[''])

  const result1 = Num.sum(
    Object.values(dirSizes).filter(s => s <= SMALL_DIR_LIMIT),
  )
  const result2 = Math.min(
    ...Object.values(dirSizes).filter(s => s >= neededSpace),
  )

  return [result1, result2, 1582412, 3696336]
}
