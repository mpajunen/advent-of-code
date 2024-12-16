#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Vec2.fs"

open Vec2

let isVertical dir = dir = Up || dir = Down

let makeMoves start moves =
    let map = Array2D.copy start
    let mutable robotAt = map |> Grid.findKey ((=) '@')

    let getMovingBoxes (dir: Dir) =
        let rec getNext previous =
            let p = previous + dir
            let tile = Grid.get map p

            match tile, isVertical dir with
            | '.', _ -> []
            | '#', _ -> [ p, tile ]
            | '[', false
            | ']', false
            | 'O', _ -> [ p, tile ] @ getNext p
            | '[', true -> [ p, tile ] @ getNext p @ [ p + Dir.Right, ']' ] @ getNext (p + Dir.Right)
            | ']', true -> [ p, tile ] @ getNext p @ [ p + Dir.Left, '[' ] @ getNext (p + Dir.Left)
            | _ -> failwith $"Invalid tile {tile}."

        getNext

    let moveTiles (dir: Dir) tiles =
        tiles |> List.iter (fun (p, _) -> Grid.set map p '.')
        tiles |> List.iter (fun (p, tile) -> Grid.set map (p + dir) tile)

    let makeMove dir =
        let tiles = [ robotAt, '@' ] @ getMovingBoxes dir robotAt

        if tiles |> List.forall (snd >> (<>) '#') then
            moveTiles dir tiles

            robotAt <- robotAt + dir

    moves |> Array.iter makeMove

    map

let gps p = p.X + 100 * p.Y

let boxTiles = [ 'O'; '[' ]

let boxGpsSum =
    Grid.findKeys (fun tile -> List.contains tile boxTiles) >> Seq.sumBy gps

let scaleTile =
    function
    | '#' -> "##"
    | 'O' -> "[]"
    | '.' -> ".."
    | '@' -> "@."
    | t -> failwith $"Invalid tile {t}."

let scaleMap = Array.map (Seq.map scaleTile >> String.concat "")

DayUtils.runDay (fun input ->
    let splitAt = input |> Array.findIndex ((=) "")
    let rawMap, rawMoves = input[.. splitAt - 1], input[splitAt + 1 ..]

    let map = rawMap |> Grid.fromRows
    let scaledMap = rawMap |> scaleMap |> Grid.fromRows
    let moves = rawMoves |> String.concat "" |> Seq.map Move.findDir |> Seq.toArray

    let result1 = makeMoves map moves |> boxGpsSum
    let result2 = makeMoves scaledMap moves |> boxGpsSum

    result1, result2, 1527563, 1521635)
