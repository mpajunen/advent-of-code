#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Vec2.fs"

open Vec2

let buildPath (maze: char[,]) =
    let start = maze |> Grid.findKey ((=) 'S')

    let getAdjacent = Grid.adjacentAvailablePositions ((<>) '#') maze

    let rec findPath path position =
        let previous = List.head path

        let next = getAdjacent position |> List.tryFind (fun p -> p <> previous)

        match next with
        | Some p -> findPath (position :: path) p
        | None -> position :: path

    getAdjacent start |> List.head |> findPath [ start ] |> List.rev

let findCheats timeLimit path =
    let costs = path |> List.indexed |> List.map (fun (i, p) -> p, i) |> Map

    let getPositionCheats position =
        let baseCost = Map.find position costs

        path
        |> List.filter (fun p -> Vec.manhattan p position <= timeLimit)
        |> List.choose (fun p ->
            let distance = Vec.manhattan p position
            let cost = Map.find p costs
            let saved = cost - distance - baseCost

            if saved >= 100 then Some(saved) else None)

    path |> List.collect getPositionCheats

DayUtils.runDay (fun input ->
    let maze = input |> Grid.fromRows

    let path = maze |> buildPath

    let result1 = path |> findCheats 2 |> List.length
    let result2 = path |> findCheats 20 |> List.length

    result1, result2, 1409, 1012821)
