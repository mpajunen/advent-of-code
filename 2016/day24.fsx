#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Input.fs"
#load "../fs-common/Vec2.fs"

open Vec2

type Distances = Map<char, Map<char, int>>

let getLocations maze =
    maze
    |> Grid.findKeys (fun tile -> tile <> '.' && tile <> '#')
    |> Seq.map (fun p -> p, Grid.get maze p)
    |> List.ofSeq

let buildDistancesFrom maze start =
    let mutable distances = maze |> Array2D.map (fun _ -> -1)

    let getNext =
        Move.adjacent
        >> List.filter (fun p -> Grid.get maze p <> '#' && Grid.get distances p = -1)

    let rec buildDistances steps frontier =
        if Seq.length frontier <> 0 then
            let next = frontier |> Seq.collect getNext |> Set

            next |> Seq.iter (fun p -> Grid.set distances p steps)

            buildDistances (steps + 1) next

    Set [ start ] |> buildDistances 1

    distances

let findMarkedDistances maze locations from =
    let distances =
        locations
        |> List.find (fun (_, tile) -> tile = from)
        |> fst
        |> buildDistancesFrom maze

    locations |> List.map (fun (p, tile) -> tile, Grid.get distances p) |> Map

let findAllMarkedDistances maze locations =
    locations
    |> Seq.map (fun (_, t) -> t, findMarkedDistances maze locations t)
    |> Map

let findShortestToMarked goBack (distances: Distances) =
    let tiles = distances |> Map.keys |> Set

    let rec findShortest' visited current =
        let remaining = tiles - visited

        if Set.isEmpty remaining then
            if goBack then distances[current]['0'] else 0
        else
            remaining
            |> Seq.map (fun tile -> distances[current][tile] + findShortest' (Set.add tile visited) tile)
            |> Seq.min

    findShortest' (Set [ '0' ]) '0'

let solve (input: string array) =
    let maze = input |> Grid.fromRows
    let locations = maze |> getLocations

    let distances = findAllMarkedDistances maze locations

    let result1 = distances |> findShortestToMarked false
    let result2 = distances |> findShortestToMarked true

    result1, result2, 470, 720

DayUtils.runDay solve
