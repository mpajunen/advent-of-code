import * as List from './List'
import { Vec2 } from './Vec2'

type Val = number | string

type Mapper<Value extends Val, Result> = (value: Value, coordinates: Vec2, grid: Grid<Value>) => Result
type Reducer<Value extends Val, Result> = (acc: Result, value: Value, coordinates: Vec2, grid: Grid<Value>) => Result

type GetValue<T> = (coordinates: Vec2) => T

const create = <T extends Val>(size: Vec2, getValue: GetValue<T>): Grid<T> => {
  const row = Array.from({ length: size.x })
  const rows = Array.from(
    { length: size.y },
    (_, y) => row.map((_, x) => getValue({ x, y })),
  )

  return new Grid(rows)
}

const combine = <T extends Val>(all: Grid<T>[][]): Grid<T> => {
  const combineRow = (grids: Grid<T>[]): T[][] => {
    const [first, ...rest] = grids.map(g => g.rows())

    return rest.reduce(
      (acc, rows) => acc.map((a, i) => [...a, ...rows[i]]),
      first,
    )
  }

  return new Grid(all.flatMap(combineRow))
}

const fromStrings = <T extends string>(rows: string[]): Grid<T> =>
  new Grid(rows.map(row => row.split('') as T[]))

export class Grid<T extends Val> {
  data: T[][]

  static create = create
  static combine = combine
  static fromStrings = fromStrings

  constructor(values: T[][]) {
    this.data = values
  }

  copy(): Grid<T> {
    return this.map(value => value)
  }

  get({ x, y }: Vec2): T | undefined {
    return this.data[y] ? this.data[y][x] : undefined
  }

  // NOTE: Mutates!
  set({ x, y }: Vec2, value: T) {
    this.data[y][x] = value
  }

  rows(): T[][] {
    return this.data
  }

  row(index): T[] {
    const y = index < 0 ? this.data.length + index : index

    return this.data[y]
  }

  columns(): T[][] {
    return this.data[0].map((_, i) => this.column(i))
  }

  column(index): T[] {
    const i = index < 0 ? this.data[0].length + index : index

    return this.data.map(row => row[i])
  }

  diagonals(): T[][] {
    const size = this.data[0].length

    return [
      this.data[0].map((_, i) => this.data[i][i]),
      this.data[0].map((_, i) => this.data[size - i - 1][i]),
    ]
  }

  flipHorizontal(): Grid<T> {
    return new Grid(this.data.map(r => [...r].reverse()))
  }

  flipVertical(): Grid<T> {
    return new Grid([...this.data.reverse()])
  }

  transpose(): Grid<T> {
    return new Grid(this.columns())
  }

  rotate(): Grid<T> {
    return new Grid(this.columns().map(c => c.reverse()))
  }

  slice(start: number, end: number): Grid<T> {
    return new Grid(this.rows().slice(start, end).map(r => r.slice(start, end)))
  }

  countBy(func: Mapper<T, boolean>): number {
    return this.map((...params) => func(...params) ? 1 : 0).valueCounts()[1]
  }

  filter(func: Mapper<T, boolean>): Grid<T> {
    return this.map((value, point) => func(value, point, this) ? value : undefined)
  }

  findMax(): { max: T, point: Vec2 } {
    let max = this.data[0][0]
    let point = { x: 0, y: 0 }

    for (let y = 0; y < this.data.length; y++) {
      const row = this.data[y]
      for (let x = 0; x < row.length; x++) {
        if (max < row[x]) {
          max = row[x]
          point = { x, y }
        }
      }
    }

    return { max, point }
  }

  findPlace(func: Mapper<T, boolean>): Vec2 {
    for (let y = 0; y < this.data.length; y++) {
      const row = this.data[y]
      for (let x = 0; x < row.length; x++) {
        if (func(row[x], { x, y }, this)) {
          return { x, y }
        }
      }
    }

    return undefined
  }

  forEach(func: Mapper<T, void>): void {
    for (let y = 0; y < this.data.length; y++) {
      const row = this.data[y]
      for (let x = 0; x < row.length; x++) {
        func(row[x], { x, y }, this)
      }
    }
  }

  map<NewT extends number | string>(func: Mapper<T, NewT>): Grid<NewT> {
    const values = this.data.map((row, y) => row.map((value, x) => func(value, { x, y }, this)))

    return new Grid(values)
  }

  mapMutate(func: Mapper<T, T>): void {
    for (let y = 0; y < this.data.length; y++) {
      const row = this.data[y]
      for (let x = 0; x < row.length; x++) {
        row[x] = func(row[x], { x, y }, this)
      }
    }
  }

  mapPart(func: Mapper<T, T>, start: Vec2, end: Vec2): Grid<T> {
    const changeRow = (row, y) =>
      row.map((value, x) => x >= start.y && y < start.y ? func(value, { x, y }, this) : value)
    const change = (row, y) =>
      y >= start.y && y < end.y ? changeRow(row, y) : row

    return new Grid(this.data.map(change))
  }

  reduce<U>(func: Reducer<T, U>, initial: U): U {
    let acc = initial

    for (let y = 0; y < this.data.length; y++) {
      const row = this.data[y]
      for (let x = 0; x < row.length; x++) {
        acc = func(acc, row[x], { x, y }, this)
      }
    }

    return acc
  }

  size = (): Vec2 => ({
    x: Math.max(...this.data.map(row => row.length)),
    y: this.data.length,
  })

  stringGrid(): string {
    return this.data.map(row => row.join('')).join('\n')
  }

  valueCounts(): Record<T, number> {
    return List.counts(this.values().filter(v => v !== undefined))
  }

  valuePlaces(value: T): Vec2[] {
    const places = []

    for (let y = 0; y < this.data.length; y++) {
      const row = this.data[y]
      for (let x = 0; x < row.length; x++) {
        if (row[x] === value) {
          places.push({ x, y })
        }
      }
    }

    return places
  }

  values(): T[] {
    return [].concat(...this.data)
  }

  entries(): [Vec2, T][] {
    const entries = []
    this.forEach((value, pair) => {
      entries.push([pair, value])
    })

    return entries
  }
}
