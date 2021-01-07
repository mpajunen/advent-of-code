import { Grid, Input, Num, List, Str, Vec2 } from '../common'

type Operator = '+' | '*'

type ExprList = (Expr | Operator)[]
type Expr = number | ExprList
type FlatList = (number | Operator)[]

const buildExpr = (row: string) => {
  const chars = row.split('').filter(c => c !== ' ')
  const list: ExprList = []
  const stack: ExprList[] = []
  let current = list

  for (const c of chars) {
    if (c === '(') {
      const sub = []
      current.push(sub)
      stack.push(current)
      current = sub
    } else if (c === ')') {
      current = stack.pop()
    } else if (c === '*' || c === '+') {
      current.push(c)
    } else {
      current.push(parseInt(c))
    }
  }

  return list
}

const op = (acc: number, [op, value]: [Operator, number]): number =>
  op === '*' ? acc * value : acc + value

const evalExpr = (expr: ExprList): number => {
  const flattened: FlatList = expr.map(e => Array.isArray(e) ? evalExpr(e) : e)

  const [first, ...rest] = flattened

  const sub = List.chunk(rest, 2)

  return sub.reduce(op, first as number)
}

const evalNew = (expr: ExprList): number => {
  const flattened: FlatList = expr.map(e => Array.isArray(e) ? evalNew(e) : e)

  const parts = List.splitBy(e => e === '*', flattened)

  const partSums = parts.map(part => part.filter(n => typeof n === 'number')).map(Num.sum)

  return Num.product(partSums)
}

export default (rows: string[]) => {
  const expressions = rows.map(buildExpr)

  // const foo = rows.map(eval)

  const result1 = Num.sum(expressions.map(evalExpr))
  const result2 = Num.sum(expressions.map(evalNew))

  return [result1, result2, 1451467526514, 224973686321527]
}
