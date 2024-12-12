#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Vec2.fs"

open Vec2

let getRegions grid =
    let processed = grid |> Array2D.map (fun _ -> false)

    let rec getRegionTiles plant position =
        if Grid.get processed position || Grid.get grid position <> plant then
            []
        else
            Grid.set processed position true

            position
            :: List.collect (getRegionTiles plant) (Grid.adjacentPositions grid position)

    [ for position in grid |> Grid.keys do
          if not <| Grid.get processed position then
              let plant = Grid.get grid position
              let region = getRegionTiles plant position

              yield region ]

let tileFences region tile =
    Move.directions
    |> List.filter (fun dir -> not <| List.contains (tile + Move.unit dir) region)
    |> List.map (fun dir -> tile, dir)

let regionFences region = List.collect (tileFences region) region

let earlierTiles tile = [ tile + Dir.Left; tile + Dir.Up ]

let isFirstTile tiles =
    earlierTiles >> List.exists (fun t -> List.contains t tiles) >> not

let dirSideCount tiles =
    tiles |> List.filter (isFirstTile tiles) |> List.length

// Count sides of region one direction at a time
let sideCount = List.groupBy snd >> List.sumBy (snd >> List.map fst >> dirSideCount)

DayUtils.runDay (fun input ->
    let regions = input |> Grid.fromRows |> getRegions

    let sizes = regions |> List.map List.length
    let fences = regions |> List.map regionFences

    let result1 = fences |> List.map List.length |> List.map2 (*) sizes |> List.sum
    let result2 = fences |> List.map sideCount |> List.map2 (*) sizes |> List.sum

    result1, result2, 1363484, 838988)
