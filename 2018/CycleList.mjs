export default class CycleList {
  constructor(values) {
    const [value, ...rest] = values

    const head = { value }
    head.next = head
    head.prev = head

    this.head = head

    rest.forEach(v => {
      this.add(v)
    })
  }

  add(value) {
    const prev = this.head
    const next = this.head.next
    const head = { value, prev, next }

    prev.next = head
    next.prev = head

    this.head = head
  }

  remove() {
    const { prev, next } = this.head

    prev.next = next
    next.prev = prev

    this.head = next
  }

  forward(steps = 1) {
    let step = 0
    while (step < steps) {
      step += 1
      this.head = this.head.next
    }
  }

  backward(steps = 1) {
    let step = 0
    while (step < steps) {
      step += 1
      this.head = this.head.prev
    }
  }
}
