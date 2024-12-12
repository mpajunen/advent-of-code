#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Input.fs"
#load "../fs-common/Vec2.fs"

open Vec2

let getRegions grid =
    let processed = grid |> Array2D.map (fun _ -> false)

    let rec getRegionTiles plant position =
        if Grid.get processed position then
            []
        else if Grid.get grid position <> plant then
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

let allDirs = [ Dir.Up; Dir.Right; Dir.Down; Dir.Left ]

let tileFences region tile =
    List.filter (Move.unit >> (+) tile >> (fun t -> not <| List.contains t region)) allDirs

let regionFences region =
    List.sumBy (tileFences region >> List.length) region

let regionSides region =
    let allTileFences = region |> List.map (fun tile -> tile, tileFences region tile)

    let fenceMap = allTileFences |> Map

    allTileFences
    |> List.sumBy (fun (tile, fences) ->
        let left =
            fenceMap |> Map.tryFind (tile + Move.unit Dir.Left) |> Option.defaultValue []

        let up = fenceMap |> Map.tryFind (tile + Move.unit Dir.Up) |> Option.defaultValue []

        fences
        |> List.filter (fun f -> not <| List.contains f left && not <| List.contains f up)
        |> List.length)

DayUtils.runDay (fun input ->
    let grid = input |> Grid.fromRows

    let regions = grid |> getRegions

    let result1 = regions |> List.sumBy (fun r -> List.length r * regionFences r)
    let result2 = regions |> List.sumBy (fun r -> List.length r * regionSides r)

    result1, result2, 1363484, 838988)
