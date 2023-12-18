#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Vec2.fs"

open Vec2

let parseRow (row: string) =
    let parts = row.Split(" ")

    parts[0][0] |> Move.findDir, int parts[1]

let getVec (row: string) =
    row |> parseRow ||> Move.create |> Move.toVec

let getCorners = Array.scan add origin

let determinant (a, b) = a.X * b.Y - a.Y * b.X

let shoelace (corners: Vec array) =
    let pairs = Array.append corners [| corners[0] |] |> Array.pairwise

    (pairs |> Array.sumBy determinant) / 2

let area (instructions: Vec array) =
    let innerArea = instructions |> getCorners |> shoelace
    let lineArea = instructions |> Array.sumBy Vec.length

    innerArea + lineArea / 2 + 1

let solve (input: string array) =
    let result1 = input |> Array.map getVec |> area
    let result2 = 0

    result1, result2, 76387, 0

DayUtils.runDay solve
