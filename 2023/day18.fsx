#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Vec2.fs"

open Vec2

let parseRow (row: string) =
    let parts = row.Split(" ")

    parts[0][0] |> Move.findDir, int parts[1]

let buildLine prev (dir, steps) =
    let step = Move.unit dir
    [| 1..steps |] |> Array.map (fun n -> add (Array.last prev) <| multiply step n)

let scale points =
    let minX = points |> Array.map _.X |> Array.min
    let minY = points |> Array.map _.Y |> Array.min

    let scaling = { X = minX; Y = minY }

    points |> Array.map (fun p -> subtract p scaling)

let fill (trench: Grid<char>) =
    let point = Grid.findKey ((=) '#') trench

    let rec fillFrom p =
        if Grid.get trench p = '.' then
            Grid.set trench p 'F'

            p |> Move.adjacent |> List.iter fillFrom

    fillFrom { X = point.X + 1; Y = point.Y + 1 }

    trench

let buildTrench instructions =
    instructions
    |> Array.scan buildLine [| origin |]
    |> Array.collect id
    |> scale
    |> Array.map (fun p -> p, '#')
    |> Map
    |> Grid.fromSparseMap '.'
    |> fill

let solve (input: string array) =
    let result1 =
        input |> Array.map parseRow |> buildTrench |> fill |> Grid.countOf ((<>) '.')

    let result2 = 0

    result1, result2, 76387, 0

DayUtils.runDay solve
