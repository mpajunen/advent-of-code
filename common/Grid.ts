import * as List from './List'
import { Vec2 } from './Vec2'

type Mapper<Value, Result> = (value: Value, coordinates: Vec2) => Result
type Reducer<Value, Result> = (acc: Result, value: Value, coordinates: Vec2) => Result


export class Grid<T extends number | string> {
  data: T[][]

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

  column(index): T[] {
    const i = index < 0 ? this.data[0].length + index : index

    return this.data.map(row => row[i])
  }

  filter(func): Grid<T> {
    return this.map((value, point) => func(value, point) ? value : undefined)
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
        if (func(row[x], { x, y })) {
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
        func(row[x], { x, y })
      }
    }
  }

  map<NewT extends number | string>(func: Mapper<T, NewT>): Grid<NewT> {
    const values = this.data.map((row, y) => row.map((value, x) => func(value, { x, y })))

    return new Grid(values)
  }

  mapMutate(func: Mapper<T, T>): void {
    for (let y = 0; y < this.data.length; y++) {
      const row = this.data[y]
      for (let x = 0; x < row.length; x++) {
        row[x] = func(row[x], { x, y })
      }
    }
  }

  mapPart(func: Mapper<T, T>, start: Vec2, end: Vec2): Grid<T> {
    const changeRow = (row, y) =>
      row.map((value, x) => x >= start.y && y < start.y ? func(value, { x, y }) : value)
    const change = (row, y) =>
      y >= start.y && y < end.y ? changeRow(row, y) : row

    return new Grid(this.data.map(change))
  }

  reduce<U>(func: Reducer<T, U>, initial: U): U {
    let acc = initial

    for (let y = 0; y < this.data.length; y++) {
      const row = this.data[y]
      for (let x = 0; x < row.length; x++) {
        acc = func(acc, row[x], { x, y })
      }
    }

    return acc
  }

  stringGrid(): string {
    return this.data.map(row => row.join('')).join('\n')
  }

  valueCounts(): Record<T, number> {
    return List.counts(this.values().filter(v => v !== undefined))
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
