#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Vec2.fs"

open Vec2

let keyPad1 =
    "
123
456
789
"

let keyPad2 =
    "
..1..
.234.
56789
.ABC.
..D..
"

let parseRow = Seq.toArray >> Seq.map (Move.findDir >> Move.unit)

let getKeys (keyPad: string) allMoves =
    let keyGrid = keyPad.Trim() |> Grid.fromString

    let isOnKey p =
        Grid.isWithin keyGrid p && Grid.get keyGrid p <> '.'

    let rec applyMove position move =
        let changedPosition = position |> add move

        if isOnKey changedPosition then
            changedPosition
        else
            position

    allMoves
    |> Array.scan (Seq.fold applyMove) (Grid.findKey ((=) '5') keyGrid)
    |> Array.tail
    |> Array.map (Grid.get keyGrid >> string)
    |> Array.reduce (+)

let solve (input: string array) =
    let moves = input |> Array.map parseRow

    let result1 = moves |> getKeys keyPad1
    let result2 = moves |> getKeys keyPad2

    result1, result2, "61529", "C2C28"

DayUtils.runDay solve
