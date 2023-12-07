#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"

// Jokers are replaced with '*' when used:
let cards = '*' :: List.append [ '2' .. '9' ] [ 'T'; 'J'; 'Q'; 'K'; 'A' ]

let cardStrength symbol = List.findIndex ((=) symbol) cards

let replaceJokers = List.map (fun c -> if c = 'J' then '*' else c)

let parseRow (row: string) =
    let parts = row.Split " "

    parts[0].ToCharArray() |> Array.toList, parts[1] |> int

let handCounts = List.countBy id >> List.sortByDescending snd // By most cards of one type

let combineJokers counts =
    match counts |> List.partition (fst >> (=) '*') with
    | [], other -> other
    | joker, [] -> joker
    | (_, jokerCount) :: _, (topCard, topCount) :: o -> (topCard, topCount + jokerCount) :: o

// Strength: ([hand card counts], [hand card strengths in original order])
// Since sorting by tuples of lists works...
let handStrength hand =
    hand |> handCounts |> combineJokers |> List.map snd, hand |> List.map cardStrength

let winnings index bid = (index + 1) * bid

let totalWinnings hands =
    hands |> Array.map snd |> Array.mapi winnings |> Array.sum

let solve (input: string array) =
    let hands = input |> Array.map parseRow

    let result1 = hands |> Array.sortBy (fst >> handStrength) |> totalWinnings

    let result2 =
        hands |> Array.sortBy (fst >> replaceJokers >> handStrength) |> totalWinnings

    result1, result2, 251058093, 249781879

DayUtils.runDay solve
