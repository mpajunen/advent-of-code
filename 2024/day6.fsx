#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Vec2.fs"

open Vec2

let moveInside map extraBlock =
    let rec move path guard =
        let forward = guard |> Actor.forward
        let tile = forward.Position |> Grid.tryGet map

        let next =
            match tile, extraBlock = Some forward.Position with
            | None, _ -> None
            | Some '#', _
            | Some _, true -> Some(guard |> Actor.turn Right)
            | Some _, false -> Some forward

        match next with
        | _ when Set.contains forward path -> path, true
        | None -> path, false
        | Some g -> move (Set.add g path) g

    let start =
        map |> Grid.findKey ((=) '^') |> (fun p -> { Position = p; Facing = Up })

    move (Set [ start ]) start

let findBlockPositions map =
    Set.filter (Some >> moveInside map >> snd)

DayUtils.runDay (fun input ->
    let map = input |> Grid.fromRows

    let positions = moveInside map None |> fst |> Set.map _.Position

    let result1 = positions |> Set.count
    let result2 = positions |> findBlockPositions map |> Set.count

    result1, result2, 5177, 1686)
