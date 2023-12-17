#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Vec2.fs"

open System.Collections.Generic
open Vec2

let LARGE = 1_000_000_000

let startingPositions =
    [ Dir.Down; Dir.Right ]
    |> List.map (fun facing -> { Position = origin; Facing = facing }, 0)

let hasFacingPenalty crucible =
    crucible.Facing = Dir.Left || crucible.Facing = Dir.Up

let getCosts (map: Grid<int>) minMove maxMove =
    let goal =
        { Y = Array2D.length1 map - 1
          X = Array2D.length2 map - 1 }

    let costs = Dictionary()
    let front = SortedSet() // Priority queue, sort of
    let mutable pathCost = LARGE

    let getPreviousCost crucible =
        match costs.TryGetValue(crucible) with
        | false, _ -> LARGE
        | true, n -> n

    let getPriority crucible =
        (manhattan crucible.Position goal) * 2
        + if hasFacingPenalty crucible then 5 * minMove else 0

    let addPosition (crucible, cost) =
        if cost < getPreviousCost crucible then
            costs[crucible] <- cost
            front.Add(getPriority crucible + cost, crucible) |> ignore

        if crucible.Position = goal && cost < pathCost then
            pathCost <- cost

    let getPossibleMoves crucible =
        let positions =
            [ 1..maxMove ]
            |> List.scan (fun p _ -> Actor.forward p) crucible
            |> List.filter (_.Position >> Grid.isWithin map)

        let costs =
            positions[1..]
            |> List.scan (fun prev a -> prev + Grid.get map a.Position) costs[crucible]

        List.zip positions[minMove..] costs[minMove..]
        |> List.collect (fun (c, cost) -> [ Actor.turn Left c, cost; Actor.turn Right c, cost ])

    startingPositions |> List.iter addPosition

    while front.Count > 0 do
        let item = front.Min
        front.Remove item |> ignore

        let _, crucible = item

        if costs[crucible] < pathCost then
            crucible |> getPossibleMoves |> List.iter addPosition

    pathCost

let solve (input: string array) =
    let map =
        input |> Array.map (_.ToCharArray() >> Array.map (string >> int)) |> array2D

    let result1 = getCosts map 1 3
    let result2 = getCosts map 4 10

    result1, result2, 817, 925

DayUtils.runDay solve
