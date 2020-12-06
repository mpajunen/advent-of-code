export class DefaultDict {
  constructor(getDefault) {
    return new Proxy({}, {
      get: (target, name) => {
        if (!(name in target)) {
          target[name] = getDefault()
        }

        return target[name]
      },
    })
  }
}
