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

let solve (input: string array) =
    let rows = input |> Array.map parseRow

    let result1 = rows |> Array.sumBy (fillDiffs >> extrapolate)
    let result2 = rows |> Array.sumBy (List.rev >> fillDiffs >> extrapolate)

    result1, result2, 1887980197, 990

DayUtils.runDay solve
