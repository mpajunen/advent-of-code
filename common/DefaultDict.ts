export class DefaultDict<K extends string | symbol, V> {
  constructor(getDefault: () => V) {
    return new Proxy({} as Record<K, V>, {
      get: (target, name: K) => {
        if (!(name in target)) {
          target[name] = getDefault()
        }

        return target[name]
      },
    })
  }
}
