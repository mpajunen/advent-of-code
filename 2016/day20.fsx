#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"

let parseRow (row: string) =
    row.Split("-") |> (fun r -> int64 r[0], int64 r[1])

let removeSlice (aMin, aMax) (bMin, bMax) =
    [ aMin, min aMax (bMin - 1L); max aMin (bMax + 1L), aMax ]
    |> List.filter (fun (a, b) -> a <= b)

let getRemainingRanges allowed block =
    allowed |> List.collect (fun a -> removeSlice a block)

let getAllowedRanges = Array.fold getRemainingRanges [ 0L, 4294967295L ]

let solve (input: string array) =
    let blacklist = input |> Array.map parseRow |> Array.sortBy (fun (low, _) -> low)

    let allowed = blacklist |> getAllowedRanges

    let result1 = allowed |> List.head |> fst
    let result2 = allowed |> List.sumBy (fun (a, b) -> b - a + 1L)

    result1, result2, 22887907L, 109L

DayUtils.runDay solve
