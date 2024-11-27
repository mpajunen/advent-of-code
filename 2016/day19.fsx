#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"

let fromNext (elves: int[]) =
    for i in 0 .. (elves.Length - 1) do
        if elves[i] <> -1 then
            let targetIndex = (i + 1) % elves.Length

            elves[targetIndex] <- -1

    elves |> Array.filter ((<>) -1)

let fromAcross (elves: int[]) =
    let mutable remaining = elves.Length
    let mutable gaps = 0

    for i in 0 .. (elves.Length - 1) do
        if elves[i] <> -1 then
            // Find target backwards halfway around the circle:
            let targetIndex = (i - (remaining + 1) / 2 - gaps + elves.Length) % elves.Length

            elves[targetIndex] <- -1
            remaining <- remaining - 1
        else
            gaps <- gaps + 1

    elves |> Array.filter ((<>) -1)

let takePresents takeRound n =
    let rec take elves =
        match takeRound elves with
        | [| n |] -> n
        | next -> take next

    Array.init n (fun i -> i + 1) |> take

let solve (input: string array) =
    let result1 = int input[0] |> takePresents fromNext
    let result2 = int input[0] |> takePresents fromAcross

    result1, result2, 1842613, 1424135

DayUtils.runDay solve
