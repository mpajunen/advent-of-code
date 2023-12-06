#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"

let parseRow (row: string) =
    row.Split(" ") |> Array.filter ((<>) "") |> Array.skip 1

let parseGames input =
    let rows = input |> Array.map (parseRow >> Array.map int64)

    Array.zip rows[0] rows[1]

let parseSingleGame input =
    let rows = input |> Array.map (parseRow >> String.concat "" >> int64)

    rows[0], rows[1]

let distance totalTime held = (totalTime - held) * held

let isWin (totalTime, record) held = distance totalTime held > record

let countSequential (totalTime, record) =
    { 0L .. totalTime } |> Seq.filter (isWin (totalTime, record)) |> Seq.length

let solve (input: string array) =
    let result1 = input |> parseGames |> Array.map countSequential |> Array.fold (*) 1
    let result2 = input |> parseSingleGame |> countSequential

    result1, result2, 227850, 42948149

DayUtils.runDay solve
