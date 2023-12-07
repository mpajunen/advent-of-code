#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"

let cards1 = List.append [ '2' .. '9' ] [ 'T'; 'J'; 'Q'; 'K'; 'A' ]
let cards2 = 'J' :: List.append [ '2' .. '9' ] [ 'T'; 'Q'; 'K'; 'A' ]

let cardStrength cards symbol = List.findIndex ((=) symbol) cards

let parseRow (row: string) =
    let parts = row.Split " "

    parts[0].ToCharArray() |> Array.toList, parts[1] |> int

let handCounts = List.countBy id >> List.sortByDescending snd // By most cards of one type

let combineJokers counts =
    match counts |> List.partition (fst >> (=) 'J') with
    | [], other -> other
    | joker, [] -> joker
    | (_, jokerCount) :: _, (topCard, topCount) :: o -> (topCard, topCount + jokerCount) :: o

// Strength: ([hand card counts], [hand card strengths in original order])
// Since sorting by tuples of lists works...
let handStrength cards convert hand =
    hand |> handCounts |> convert |> List.map snd, hand |> List.map (cardStrength cards)

let winnings index bid = (index + 1) * bid

let totalWinnings hands =
    hands |> Array.map snd |> Array.mapi winnings |> Array.sum

let solve (input: string array) =
    let hands = input |> Array.map parseRow

    let result1 = hands |> Array.sortBy (fst >> handStrength cards1 id) |> totalWinnings

    let result2 =
        hands
        |> Array.sortBy (fst >> handStrength cards2 combineJokers)
        |> totalWinnings

    result1, result2, 251058093, 249781879

DayUtils.runDay solve
