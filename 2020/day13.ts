type Service = { every: number, after: number }

const part1 = (id: number, services: Service[]) => {
  const waits = services.map(s => s.every - id % s.every)
  const short = Math.min(...waits)
  const index = waits.indexOf(short)

  return services[index].every * short
}

const findCommon = (base: Service, service: Service): Service => {
  const every = base.every * service.every
  let after = base.after

  while (true) {
    if ((after + service.after) % service.every === 0) {
      // console.log(base, service)
      // console.log((base.every * service.after + base.after * service.every) % every)
      return { every, after }
    }

    after += base.every
  }
}

export default ([row1, row2]: string[]) => {
  const id = parseInt(row1)
  const services = row2.split(',').flatMap(
    (value, index) => value !== 'x' ? { every: parseInt(value), after: index } : [],
  )

  const result1 = part1(id, services)
  const result2 = services.reduce(findCommon, { every: 1, after: 0 }).after

  return [result1, result2, 2238, 560214575859998]
}
