#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Vec2.fs"

open Vec2

let allPairs positions =
    positions
    |> Seq.collect (fun a -> positions |> Seq.map (fun b -> a, b))
    |> Seq.filter (fun (a, b) -> a < b)

let getAntennas = Grid.entries >> Seq.filter (snd >> ((<>) '.'))

let getAntennaPairs =
    Seq.groupBy snd >> Seq.collect (snd >> Seq.map fst >> allPairs)

let pairBasicNodes grid (a, b) =
    [ a + a - b; b + b - a ] |> List.filter (Grid.isWithin grid)

let pairHarmonicNodes grid (a, b) =
    let step = b - a

    let rec getSide op p =
        let next = op p step

        if Grid.isWithin grid next then
            next :: getSide op next
        else
            []

    getSide (-) a @ [ a ] @ getSide (+) a

let getAntinodeCount getForPair =
    Seq.collect getForPair >> Seq.distinct >> Seq.length

DayUtils.runDay (fun input ->
    let grid = input |> Grid.fromRows
    let antennaPairs = grid |> getAntennas |> getAntennaPairs

    let result1 = antennaPairs |> getAntinodeCount (pairBasicNodes grid)
    let result2 = antennaPairs |> getAntinodeCount (pairHarmonicNodes grid)

    result1, result2, 413, 1417)
