#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Input.fs"
#load "../fs-common/Vec2.fs"

open Vec2

let makeMoves start (moves: Dir array) =
    let map = Array2D.copy start
    let mutable robotAt = map |> Grid.findKey ((=) '@')

    let makeMove (dir: Dir) =
        let rec getMoveTiles tiles =
            let position, _ = tiles |> List.head

            match Grid.get map position with
            | '#' -> []
            | '.' -> tiles
            | 'O' -> ((position + dir, 'O') :: tiles) |> getMoveTiles
            | t -> failwith $"Invalid tile {t}."

        let newTiles = [ robotAt + dir, '@'; robotAt, '.' ] |> getMoveTiles

        if newTiles.Length <> 0 then
            newTiles |> List.iter (fun (position, tile) -> Grid.set map position tile)

            robotAt <- robotAt + dir

    moves |> Array.iter makeMove

    map

let gps p = p.X + 100 * p.Y

let boxGpsSum = Grid.findKeys ((=) 'O') >> Seq.sumBy gps

DayUtils.runDay (fun input ->
    let splitAt = input |> Array.findIndex ((=) "")
    let rawMap, rawMoves = input.[.. splitAt - 1], input.[splitAt + 1 ..]

    let map = rawMap |> Grid.fromRows
    let moves = rawMoves |> String.concat "" |> Seq.map Move.findDir |> Seq.toArray

    let result1 = makeMoves map moves |> boxGpsSum
    let result2 = 0

    result1, result2, 1527563, 0)
