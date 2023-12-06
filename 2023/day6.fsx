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

let countSequentialRange (totalTime, record) =
    let min = { 0L .. totalTime } |> Seq.find (isWin (totalTime, record))
    let max = { 0L .. totalTime } |> Seq.findBack (isWin (totalTime, record))

    max - min + 1L |> int

// Quadratic equation: ax^2 + bx + c = 0
// Solution: (-b ± √(b^2 - 4ac)) / 2a
let solveQuadratic a b c =
    let solveOne op =
        (op -b (sqrt (b ** 2.0 - 4.0 * a * c))) / (2.0 * a)

    solveOne (-), solveOne (+)

// Condition: (totalTime - held) * held > record
// Equation: held^2 - totalTime * held + record = 0
let countQuadratic (totalTime, record) =
    let time1, time2 = solveQuadratic 1 (float -totalTime) (float record)

    // Use non-winning points and subtract to get correct result if solution matches record exactly
    ceil time2 - floor time1 - 1.0 |> int

let solve (input: string array) =
    let result1 = input |> parseGames |> Array.map countSequentialRange |> Array.fold (*) 1
    let result2 = input |> parseSingleGame |> countSequentialRange

    result1, result2, 227850, 42948149

DayUtils.runDay solve
