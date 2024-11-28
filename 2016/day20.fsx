#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"

let parseRow (row: string) =
    row.Split("-") |> (fun r -> int64 r[0], int64 r[1])

let findLowestAllowed =
    Array.fold (fun lowest (low, high) -> if lowest < low then lowest else max lowest (high + 1L)) 0L

let solve (input: string array) =
    let blacklist = input |> Array.map parseRow |> Array.sortBy (fun (low, _) -> low)

    let result1 = blacklist |> findLowestAllowed
    let result2 = 0

    result1, result2, 22887907L, 0

DayUtils.runDay solve
