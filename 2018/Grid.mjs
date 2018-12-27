import * as common from './common'

export const add = ([xa, ya]) => ([xb, yb]) => [xb + xa, yb + ya]

export const manhattan = ([x1, y1]) => ([x2, y2]) =>
  Math.abs(x1 - x2) + Math.abs(y1 - y2)

export function createGrid(getValue, width, height = undefined) {
  const createRow = i =>
    Array.from({ length: width },(_, j) => getValue([i, j]))
  const values = common.emptyArray(height || width, createRow)

  return new Grid(values)
}

export default class Grid {
  constructor(values) {
    this.data = values
  }

  copy() {
    return this.map(value => value)
  }

  get([i, j]) {
    return this.data[j] ? this.data[j][i] : undefined
  }

  // NOTE: Mutates!
  set([i, j], value) {
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

  findPlace(func) {
    for (let j = 0; j < this.data.length; j++) {
      const row = this.data[j]
      for (let i = 0; i < row.length; i++) {
        if (func(row[i], [j, i])) {
          return [i, j]
        }
      }
    }

    return undefined
  }

  map(func) {
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

  values() {
    return [].concat(...this.data)
  }
}
