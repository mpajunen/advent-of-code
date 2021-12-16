type Key = number | string

export class Counts<T extends Key = Key> {
  constructor(public counts: Partial<Record<T, number>> = {}) {
  }

  static fromEntries<T extends Key>(entries: [T, number][]): Counts<T> {
    const counts = new Counts()
    entries.forEach(([key, count]) => {
      counts.add(key, count)
    })

    return counts
  }

  add(key: T, count: number): void {
    this.counts[key] = (this.counts[key] ?? 0) + count
  }

  entries = (): [string, number][] => Object.entries(this.counts)

  get = (key: T): number => this.counts[key] ?? 0

  max = (): number => Math.max(...this.values())

  min = (): number => Math.min(...this.values())

  values = (): number[] => Object.values(this.counts)
}
