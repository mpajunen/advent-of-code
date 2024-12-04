#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Input.fs"
#load "../fs-common/Vec2.fs"

open Vec2

let xmas = "XMAS" |> Seq.toList

let xmasPositionOptions =
    Vec.unitsAll |> List.map (fun unit -> List.map (multiply unit) [ 0..3 ])

let countXmas grid =
    let isPattern start =
        List.choose (add start >> Grid.tryGet grid) >> (=) xmas

    let countTile start =
        xmasPositionOptions |> List.filter (isPattern start) |> List.length

    grid |> Grid.keys |> Seq.sumBy countTile

let xPatterns = [ "AMMSS"; "ASMMS"; "ASSMM"; "AMSSM" ] |> List.map Seq.toList

let countX grid =
    let countTile center =
        (origin :: Vec.unitsDiagonal)
        |> List.choose (add center >> Grid.tryGet grid)
        |> fun x -> if List.contains x xPatterns then 1 else 0

    grid |> Grid.keys |> Seq.sumBy countTile

DayUtils.runDay (fun input ->
    let grid = input |> Grid.fromRows

    let result1 = grid |> countXmas
    let result2 = grid |> countX

    result1, result2, 2571, 1992)
