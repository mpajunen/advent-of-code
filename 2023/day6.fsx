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

// ~500 ms, 59_708_168 checks
let countSequential (totalTime, record) =
    { 0L .. totalTime } |> Seq.filter (isWin (totalTime, record)) |> Seq.length

// ~1000 ms, 16_759_916 checks
let countSequentialRange (totalTime, record) =
    let min = { 0L .. totalTime } |> Seq.find (isWin (totalTime, record))
    let max = { 0L .. totalTime } |> Seq.findBack (isWin (totalTime, record))

    max - min + 1L |> int

// ~5 ms, 92 checks
let countBinarySearch (totalTime, record) =
    let rec findLast inside outside =
        if abs (inside - outside) = 1L then
            inside
        else
            let middle = (outside + inside) / 2L

            if isWin (totalTime, record) middle then
                findLast middle outside
            else
                findLast inside middle

    let min = findLast (totalTime / 2L) 0L
    let max = findLast (totalTime / 2L) totalTime

    max - min + 1L |> int

// Quadratic equation: ax^2 + bx + c = 0
// Solution: (-b ± √(b^2 - 4ac)) / 2a
let solveQuadratic a b c =
    let solveOne op =
        (op -b (sqrt (b ** 2.0 - 4.0 * a * c))) / (2.0 * a)

    solveOne (-), solveOne (+)

// Condition: (totalTime - held) * held > record
// Equation: held^2 - totalTime * held + record = 0
// ~5 ms
let countQuadratic (totalTime, record) =
    let time1, time2 = solveQuadratic 1 (float -totalTime) (float record)

    // Use non-winning points and subtract to get correct result if solution matches record exactly
    ceil time2 - floor time1 - 1.0 |> int

let solve count (input: string array) =
    let result1 = input |> parseGames |> Array.map count |> Array.fold (*) 1
    let result2 = input |> parseSingleGame |> count

    result1, result2, 227850, 42948149

DayUtils.runDay (solve countBinarySearch)
