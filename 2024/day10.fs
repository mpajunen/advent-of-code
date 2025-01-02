module Year2024.Day10

open Vec2

let score unique grid =
    let rec trails position =
        match position |> Grid.get grid with
        | 9 -> [ position ]
        | tile ->
            Grid.adjacentPositions grid position
            |> List.filter (fun p -> Grid.get grid p = tile + 1)
            |> List.collect trails

    let tileScore position =
        match position |> Grid.get grid with
        | 0 -> position |> trails |> (if unique then List.distinct else id) |> List.length
        | _ -> 0

    grid |> Grid.keys |> Seq.sumBy tileScore

let solve = DayUtils.solveDay (fun input ->
    let grid = input |> Grid.fromRows |> Array2D.map (string >> int)

    let result1 = grid |> score true
    let result2 = grid |> score false

    result1, result2, 574, 1238)
