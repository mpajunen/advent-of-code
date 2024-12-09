#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Vec2.fs"

open Vec2

let moveInside map extraBlock =
    let rec findNext guard =
        let forward = guard |> Actor.forward
        let tile = forward.Position |> Grid.tryGet map

        match tile, extraBlock = Some forward.Position with
        | None, _ -> guard, true
        | Some '#', _
        | Some _, true -> guard |> Actor.turn Right, false
        | Some _, false -> forward |> findNext

    let rec move path =
        findNext
        >> function
            | guard, _ when List.contains guard path -> path, true
            | guard, true -> guard :: path, false
            | guard, false -> move (guard :: path) guard

    let start =
        map |> Grid.findKey ((=) '^') |> (fun p -> { Position = p; Facing = Up })

    move [ start ] start

let findBlockPositions map =
    List.filter (Some >> moveInside map >> snd)

let getPositions = List.pairwise >> List.collect (Line.points) >> List.distinct

DayUtils.runDay (fun input ->
    let map = input |> Grid.fromRows

    let corners = moveInside map None |> fst |> List.map _.Position
    let positions = corners |> getPositions

    let result1 = positions |> List.length
    let result2 = positions |> findBlockPositions map |> List.length

    result1, result2, 5177, 1686)
