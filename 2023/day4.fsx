#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"

let parseNumbers (s: string) =
    s.Split " " |> Array.filter ((<>) "") |> Array.map int |> Set

let parseCard (row: string) =
    row.Split([| ':'; '|' |])[1..]
    |> Array.map parseNumbers
    |> Set.intersectMany
    |> Set.count

let points wins = pown 2 (wins - 1)

let cardCounts cards =
    let counts = cards |> Array.map (fun _ -> 1)

    for index, card in Array.indexed cards do
        for addIndex in { index + 1 .. index + card } do
            counts[addIndex] <- counts[addIndex] + counts[index]

    counts

let solve (input: string array) =
    let cards = input |> Array.map parseCard

    let result1 = cards |> Array.sumBy points
    let result2 = cards |> cardCounts |> Array.sum

    result1, result2, 25010, 9924412

DayUtils.runDay solve
