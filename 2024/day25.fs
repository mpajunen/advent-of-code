module Year2024.Day25

open Vec2

let patternSize = 7

let getHeight = Array.countBy id >> Map >> Map.find '#'

let parsePattern (rows: string[]) =
    rows[0][0] = '#', rows[.. patternSize - 1] |> Grid.fromRows |> Grid.cols |> Array.map getHeight

let fitsLock = Array.forall2 (fun l k -> l + k <= patternSize)

let solve = DayUtils.solveDay (fun input ->
    let all = input |> Array.chunkBySize (patternSize + 1) |> Array.map parsePattern

    let locks, keys = all |> Array.partition fst

    let result1 =
        Array.allPairs locks keys
        |> Array.sumBy (fun ((_, l), (_, k)) -> if fitsLock l k then 1 else 0)

    result1, (), 3162, ())
