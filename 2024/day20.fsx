#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Vec2.fs"

open Vec2

let buildPath maze =
    let getAdjacent = Grid.adjacentAvailablePositions ((<>) '#') maze

    let rec findPath path position =
        match position |> getAdjacent |> List.tryFind (fun p -> Some p <> List.tryHead path) with
        | Some p -> findPath (position :: path) p
        | None -> position :: path

    maze |> Grid.findKey ((=) 'S') |> findPath [] |> List.rev |> List.indexed

let getCheatCount timeLimit path =
    let getPositionCheatCount (baseCost, from) =
        path
        |> List.sumBy (fun (cost, p) ->
            let distance = Vec.manhattan from p
            let saved = cost - baseCost - distance

            if distance <= timeLimit && saved >= 100 then 1 else 0)

    path |> List.sumBy getPositionCheatCount

DayUtils.runDay (fun input ->
    let path = input |> Grid.fromRows |> buildPath

    let result1 = path |> getCheatCount 2
    let result2 = path |> getCheatCount 20

    result1, result2, 1409, 1012821)
