module Year2024.Day12

open Vec2

let getRegions grid =
    let processed = grid |> Array2D.map (fun _ -> false)

    let rec getRegion plant tile =
        if Grid.get processed tile then
            []
        else
            Grid.set processed tile true

            let neighbors, edges =
                Move.directions
                |> List.partition ((+) tile >> Grid.tryGet grid >> (=) (Some plant))

            (tile, edges) :: (neighbors |> List.collect ((+) tile >> getRegion plant))

    [ for position in grid |> Grid.keys do
          if not <| Grid.get processed position then
              let plant = Grid.get grid position

              yield getRegion plant position ]

let regionFences =
    List.collect (fun (tile, edges) -> edges |> List.map (fun edge -> tile, edge))

let earlierTiles tile = [ tile + Dir.Left; tile + Dir.Up ]

let dirSideCount dirTiles =
    let isFirstTile =
        earlierTiles >> List.exists (fun t -> List.contains t dirTiles) >> not

    dirTiles |> List.filter isFirstTile |> List.length

// Count sides of region one direction at a time
let sideCount = List.groupBy snd >> List.sumBy (snd >> List.map fst >> dirSideCount)

let solve =
    DayUtils.solveDay (fun input ->
        let regions = input |> Grid.fromRows |> getRegions

        let sizes = regions |> List.map List.length
        let fences = regions |> List.map regionFences

        let result1 = fences |> List.map List.length |> List.map2 (*) sizes |> List.sum
        let result2 = fences |> List.map sideCount |> List.map2 (*) sizes |> List.sum

        result1, result2, 1363484, 838988)
