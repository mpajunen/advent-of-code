import * as common from './common'

export type CoordinatePair = [number, number]

export type Callback<Value, Result> = (value: Value, coordinates: CoordinatePair) => Result

export default class Grid<T extends number | string> {
  data: T[][]

  constructor(values: T[][]) {
    this.data = values
  }

  copy() {
    return this.map(value => value)
  }

  get([i, j]) {
    return this.data[j] ? this.data[j][i] : undefined
  }

  // NOTE: Mutates!
  set([i, j]: CoordinatePair, value: T) {
    this.data[j][i] = value
  }

  rows() {
    return this.data
  }

  row(index) {
    const j = index < 0 ? this.data.length + index : index

    return this.data[j]
  }

  column(index) {
    const i = index < 0 ? this.data[0].length + index : index

    return this.data.map(row => row[i])
  }

  filter(func) {
    return this.map((value, point) => func(value, point) ? value : undefined)
  }

  findMax() {
    let max = this.data[0][0]
    let point = [0, 0]

    for (let j = 0; j < this.data.length; j++) {
      const row = this.data[j]
      for (let i = 0; i < row.length; i++) {
        if (max < row[i]) {
          max = row[i]
          point = [i, j]
        }
      }
    }

    return { max, point }
  }

  findPlace(func: Callback<T, boolean>): CoordinatePair {
    for (let j = 0; j < this.data.length; j++) {
      const row = this.data[j]
      for (let i = 0; i < row.length; i++) {
        if (func(row[i], [i, j])) {
          return [i, j]
        }
      }
    }

    return undefined
  }

  forEach(func: Callback<T, void>): void {
    for (let j = 0; j < this.data.length; j++) {
      const row = this.data[j]
      for (let i = 0; i < row.length; i++) {
        func(row[i], [i, j])
      }
    }
  }

  map<NewT extends number | string>(func: Callback<T, NewT>): Grid<NewT> {
    const values = this.data
      .map((row, j) => row.map((value, i) => func(value, [i, j])))

    return new Grid(values)
  }

  mapMutate(func) {
    for (let j = 0; j < this.data.length; j++) {
      const row = this.data[j]
      for (let i = 0; i < row.length; i++) {
        row[i] = func(row[i], [i, j])
      }
    }
  }

  mapPart(func, [startX, startY], [endX, endY]) {
    const changeRow = (row, j) =>
      row.map((value, i) => i >= startY && i < endY ? func(value, [i, j]) : value)
    const change = (row, j) =>
      j >= startX && j < endX ? changeRow(row, j) : row

    return new Grid(this.data.map(change))
  }

  reduce(func, initial) {
    let acc = initial

    for (let j = 0; j < this.data.length; j++) {
      const row = this.data[j]
      for (let i = 0; i < row.length; i++) {
        acc = func(acc, row[i], [i, j])
      }
    }

    return acc
  }

  stringGrid() {
    return this.data
      .map(row => row.join(''))
      .join('\n')
  }

  valueCounts() {
    return common.arrayCounts(this.values().filter(v => v !== undefined))
  }

  values(): T[] {
    return [].concat(...this.data)
  }

  entries(): [CoordinatePair, T][] {
    const entries = []
    this.forEach((value, pair) => {
      entries.push([pair, value])
    })

    return entries
  }
}
