#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Vec2.fs"

let parseRow (row: string) =
    row.Split(' ') |> Array.filter (fun s -> s.Length > 0) |> Array.map int

let isPossible sides =
    let sorted = sides |> Array.sort

    sorted[0] + sorted[1] > sorted[2]

let getVertical =
    array2D >> Vec2.Grid.cols >> Seq.reduce Array.append >> Seq.chunkBySize 3

let solve (input: string array) =
    let triangles = input |> Array.map parseRow

    let result1 = triangles |> Seq.filter isPossible |> Seq.length
    let result2 = triangles |> getVertical |> Seq.filter isPossible |> Seq.length

    result1, result2, 869, 1544

DayUtils.runDay solve
