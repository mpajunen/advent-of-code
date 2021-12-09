import { Grid, List, Num, Vec2 } from '../common'

type Value = '.' | '#'
type Values = Grid<Value>

type Tile = { id: number, grid: Values }

const SEA_MONSTER_IMAGE =
`                  # 
#    ##    ##    ###
 #  #  #  #  #  #   `

const SEA_MONSTER = new Grid<'#' | ' '>(
  SEA_MONSTER_IMAGE.split('\n').map(row => row.split('') as any[])
)
  .entries()
  .filter(([, value]) => value === '#')
  .map(([location]) => location)

const getTile = (rows: string[]): Grid<Value> =>
  new Grid(rows.map(r => r.split('') as Value[]))

const getInput = (rows: string[]) =>
  List.splitBy(r => r === '', rows).map(tileRows => {
    const [first, ...rest] = tileRows
    const id = parseInt(first.slice(5, -1))

    return { id, grid: getTile(rest) }
  })

type Borders = { id: number, borders: number[] }

const getChecksum = (edge: Value[]): number =>
  parseInt(edge.map(v => v === '#' ? 1 : 0).join(''), 2)

const getBorderValues = ({ id, grid }: Tile): Borders => {
  const directed = [grid.row(0), grid.row(-1), grid.column(0), grid.column(-1)]
  const all = [...directed, ...directed.map(l => [...l].reverse())]

  const borders = all.map(getChecksum)

  return { id, borders }
}

const getEdges = (all: Borders[]) => (checked: Borders): Borders => ({
  id: checked.id,
  borders: all.filter(val => val.id !== checked.id)
    .reduce(
      (acc, val) => acc.filter(v => !val.borders.includes(v)),
      checked.borders,
    ),
})

const getAlternatives = (values: Values): Values[] =>
  [values, values.rotate().rotate()]
    .flatMap(g => [g, g.rotate()])
    .flatMap(g => [g, g.flipHorizontal()])

const findOrientation = ({ id, grid }: Tile, left: number[], top: number[]): Tile => {
  const options = getAlternatives(grid)
    .filter(t => left.length === 0 || left.includes(getChecksum(t.column(0))))
    .filter(t => top.length === 0 || top.includes(getChecksum(t.row(0))))

  return { id, grid: options[0] }
}

const formImage = (tiles: Tile[], borders: Borders[], [first]: Borders[]) => {
  const tileMap = Object.fromEntries(tiles.map(t => [t.id, t]))

  const findTile = (fromId: number, left?: number, top?: number): Tile | undefined => {
    const found = borders.find(b =>
      b.id !== fromId &&
      (left === undefined || b.borders.includes(left)) &&
      (top === undefined || b.borders.includes(top))
    )

    return !found ? undefined : findOrientation(tileMap[found.id], left ? [left] : [], top ? [top] : [])
  }

  const start = findOrientation(tileMap[first.id], first.borders, first.borders)

  const buildRow = (row: Tile[]): Tile[] => {
    const previous = row[row.length - 1]
    const next = findTile(previous.id, getChecksum(previous.grid.column(-1)))

    return next ? buildRow([...row, next]) : row
  }

  const buildRows = (rows: Tile[][]): Tile[][] => {
    const previous = rows[rows.length - 1][0]
    const nextStart = findTile(previous.id, undefined, getChecksum(previous.grid.row(-1)))

    return nextStart ? buildRows([...rows, buildRow([nextStart])]) : rows
  }

  const rows = buildRows([buildRow([start])])

  return Grid.combine(rows.map(r => r.map(t => t.grid.slice(1, -1))))
}

const getSingleMonsterCount = (values: Values): number => {
  const isInPos = (v, pos: Vec2.Vec2): 1 | 0 =>
    SEA_MONSTER.every(monster => values.get(Vec2.add(pos, monster)) === '#') ? 1 : 0

  return values.map(isInPos).valueCounts()[1]
}

const getMonsterCounts = (values: Values) =>
  getAlternatives(values).map(getSingleMonsterCount)

export default (rows: string[]) => {
  const input = getInput(rows)

  const borders = input.map(getBorderValues)
  const edges = borders.map(getEdges(borders))
  const corners = edges.filter(e => e.borders.length === 4)

  const image = formImage(input, borders, corners)
  const count = getMonsterCounts(image).find(v => v !== undefined)

  const result1 = Num.product(corners.map(c => c.id))
  const result2 = image.valueCounts()['#'] - (count * SEA_MONSTER.length)

  return [result1, result2, 27803643063307, 1644]
}
