#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Vec2.fs"

open Vec2

let parseInstruction (instruction: string) =
    match instruction[0], int instruction[1..] with
    | 'R', n -> (Turn.Right, n)
    | 'L', n -> (Turn.Left, n)
    | _ -> failwith $"Invalid instruction {instruction}"

let move (actor: Actor) (turn, move) =
    actor |> Actor.turn turn |> Actor.forwardSteps move

let initial = { Facing = Dir.Up; Position = origin }

let getLocations = Array.scan move initial >> Array.map _.Position

let rec findIntersection (segments: Line array) =
    // The end point of the segment is the start point of the next segment, skip that intersection:
    match segments[2..] |> Array.tryPick (Line.getIntersection segments[0]) with
    | Some intersection -> intersection
    | None -> findIntersection segments[1..]

let solve (input: string array) =
    let instructions = input[0].Split ", " |> Array.map parseInstruction

    let locations = instructions |> getLocations

    let result1 = locations |> Array.last |> Vec.length
    let result2 = locations |> Array.pairwise |> findIntersection |> Vec.length

    result1, result2, 246, 124

DayUtils.runDay solve
