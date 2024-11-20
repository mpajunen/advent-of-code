#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Vec2.fs"

open Vec2

let parseRow (row: string) = row

let solve (input: string array) =
    let inp = input |> Array.map parseRow

    let result1 = 0
    let result2 = 0

    result1, result2, 0, 0

DayUtils.runDay solve
