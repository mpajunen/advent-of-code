#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"

let parseRow (row: string) =
    row.Split " " |> Array.map int |> Array.toList

let diffNext = List.pairwise >> List.map ((fun (a, b) -> b - a))

let rec fillDiffs =
    function
    | [ 0 ] -> [ [ 0 ] ] // May include extra rows, up to a single zero
    | row -> row :: (row |> diffNext |> fillDiffs)

let extrapolate = List.sumBy List.last

let extrapolateBack = List.map List.head >> List.reduceBack (-)

let solve (input: string array) =
    let filled = input |> Array.map (parseRow >> fillDiffs)

    let result1 = filled |> Array.sumBy extrapolate
    let result2 = filled |> Array.sumBy extrapolateBack

    result1, result2, 1887980197, 990

DayUtils.runDay solve
