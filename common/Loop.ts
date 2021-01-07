type GetChecksum<State> = (state: State) => number | string
type Check<State> = (state: State) => boolean

export const createCheck = <T>(getChecksum: GetChecksum<T>): Check<T> => {
  const earlier: Record<number | string, boolean> = {}

  return state => {
    const checksum = getChecksum(state)

    if (earlier[checksum]) {
      return true
    } else {
      earlier[checksum] = true
      return false
    }
  }
}
