#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Vec2.fs"

open Vec2

let dirs = [ Dir.Right; Dir.Down; Dir.Left; Dir.Up ]

let parse1 (parts: string array) =
    parts[0][0] |> Move.findDir, int parts[1]

let parse2 (parts: string array) =
    dirs[parts[2][7..7] |> int], System.Convert.ToInt32(parts[2][2..6], 16)

let getVec parse (row: string) =
    row.Split(" ") |> parse ||> Move.create |> Move.toVec

let getCorners = Array.scan (+) origin

let determinant (a, b) =
    int64 a.X * int64 b.Y - int64 a.Y * int64 b.X

let shoelace (corners: Vec array) =
    let pairs = Array.append corners [| corners[0] |] |> Array.pairwise

    (pairs |> Array.sumBy determinant) / 2L

let area (instructions: Vec array) =
    let innerArea = instructions |> getCorners |> shoelace
    let lineArea = instructions |> Array.sumBy Vec.length

    innerArea + int64 lineArea / 2L + 1L

let solve (input: string array) =
    let result1 = input |> Array.map (getVec parse1) |> area
    let result2 = input |> Array.map (getVec parse2) |> area

    result1, result2, 76387L, 250022188522074L

DayUtils.runDay solve
