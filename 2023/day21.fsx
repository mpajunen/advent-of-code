#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Vec2.fs"

open System.Collections.Generic
open Vec2

let LARGE_COST = 1_000_000

let getCosts start grid =
    let mutable front = Set.singleton start
    let costs = Array2D.map (fun _ -> LARGE_COST) grid
    Grid.set costs start 0

    let isAvailableStep p =
        Grid.isWithin grid p && Grid.get grid p <> '#' && Grid.get costs p = LARGE_COST

    let mutable step = 1

    while not front.IsEmpty do
        front <-
            front
            |> Set.toList
            |> List.collect Move.adjacent
            |> Set
            |> Set.filter isAvailableStep

        for p in front do
            Grid.set costs p step

        step <- step + 1

    costs

let solve (input: string array) =
    let grid = input |> Grid.fromRows
    let start = grid |> Grid.findKey ((=) 'S')

    let costs = grid |> getCosts start

    printfn "%A" costs

    let result1 = costs |> Grid.countOf (fun n -> n <= 64 && n % 2 = 0)
    let result2 = 0

    result1, result2, 3572, 0

DayUtils.runDay solve
