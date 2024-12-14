#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Input.fs"
#load "../fs-common/Vec2.fs"

open Vec2

type Robot = { Position: Vec; Velocity: Vec }

let parseRobot =
    Input.parseAllInts
    >> List.chunkBySize 2
    >> List.map (fun r -> { X = r[0]; Y = r[1] })
    >> (fun r -> { Position = r[0]; Velocity = r[1] })

let area = { X = 101; Y = 103 }

let center = { X = area.X / 2; Y = area.Y / 2 }

let getPositionAfter time robot =
    let raw = robot.Position + robot.Velocity * time

    { X = (raw.X % area.X + area.X) % area.X
      Y = (raw.Y % area.Y + area.Y) % area.Y }

let getQuadrant position =
    match compare position.X center.X, compare position.Y center.Y with
    | 0, _ -> None
    | _, 0 -> None
    | quadrant -> Some quadrant

let getFinalQuadrantCounts =
    Array.map (getPositionAfter 100)
    >> Array.choose getQuadrant
    >> Array.countBy id
    >> Array.map snd

let findChristmasTreeTime robots =
    let getAdjacentCount time =
        let positions = robots |> Array.map (getPositionAfter time)

        let positionSet = positions |> Set

        positions
        |> Array.sumBy (fun p ->
            Vec.unitsAll
            |> List.sumBy (fun u -> if positionSet.Contains(p + u) then 1 else 0))

    let rec findTime time =
        let count = getAdjacentCount time

        if count > 1500 then // Determined by looking at the output :)
            time
        else
            findTime (time + 1)

    findTime 1

DayUtils.runDay (fun input ->
    let robots = input |> Array.map parseRobot

    let result1 = robots |> getFinalQuadrantCounts |> Array.reduce (*)
    let result2 = robots |> findChristmasTreeTime

    result1, result2, 232253028, 8179)
