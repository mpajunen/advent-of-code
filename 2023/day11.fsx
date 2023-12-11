#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Vec2.fs"

open Vec2

let uniquePairs items =
    [ for index, a in List.indexed items do
          for b in items[index + 1 ..] do
              yield a, b ]

let hasNoGalaxies = Array.contains '#' >> not

let getEmptyIndices =
    Seq.indexed >> Seq.filter (snd >> hasNoGalaxies) >> Seq.map fst >> Set

let parseInput (input: string array) =
    let grid = input |> Array.map _.ToCharArray() |> array2D

    let galaxies = grid |> Grid.findKeys ((=) '#') |> Seq.toList
    let emptyRows = grid |> Grid.rows |> getEmptyIndices
    let emptyCols = grid |> Grid.cols |> getEmptyIndices

    let getShift g =
        { X = emptyCols |> Set.filter (fun n -> n < g.X) |> Set.count
          Y = emptyRows |> Set.filter (fun n -> n < g.Y) |> Set.count }

    let shifts = galaxies |> List.map getShift

    List.zip galaxies shifts

// Add "normal" distance and distance caused by expansion separately, then combine
let pairDistance expansionFactor ((aBase, aExp), (bBase, bExp)) =
    (manhattan aBase bBase |> int64)
    + (manhattan aExp bExp |> int64) * (expansionFactor - 1L)

let solve (input: string array) =
    let pairs = input |> parseInput |> uniquePairs

    let result1 = pairs |> List.sumBy (pairDistance 2)
    let result2 = pairs |> List.sumBy (pairDistance 1_000_000)

    result1, result2, 9639160L, 752936133304L

DayUtils.runDay solve
