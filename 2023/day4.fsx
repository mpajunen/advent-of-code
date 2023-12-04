#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"

type Card =
    { Id: int
      Winning: int Set
      Have: int Set }

let parseNumbers (s: string) =
    s.Split " " |> Array.filter ((<>) "") |> Array.map int |> Set

let parseCard (row: string) =
    let parts = row.Split [| ':'; '|' |]

    { Id = parts[0].Split " " |> Array.last |> int
      Winning = parts[1] |> parseNumbers
      Have = parts[2] |> parseNumbers }

let matching (card: Card) =
    Set.intersect card.Have card.Winning |> Set.count

let points wins = pown 2 (wins - 1)

let cardCounts cards =
    let counts = cards |> Array.map (fun _ -> 1)

    for index, card in Array.indexed cards do
        for addIndex in { index + 1 .. index + matching card } do
            counts[addIndex] <- counts[addIndex] + counts[index]

    counts

let solve (input: string array) =
    let cards = input |> Array.map parseCard

    let result1 = cards |> Array.sumBy (matching >> points)
    let result2 = cards |> cardCounts |> Array.sum

    result1, result2, 25010, 9924412

DayUtils.runDay solve
