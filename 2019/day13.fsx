#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Vec2.fs"
#load "./IntCode.fs"

open Vec2

let drawTile tile =
    match tile with
    | 0 -> " "
    | 1 -> "#"
    | 2 -> "x"
    | 3 -> "="
    | 4 -> "o"
    | _ -> failwith <| sprintf $"Invalid tile {tile}!"

let draw painted =
    painted |> Grid.fromSparseMap 0 |> Array2D.map drawTile |> Grid.toString

let debugPrint tiles = tiles |> draw |> printfn "%s"

let toTiles instructions =
    instructions
    |> Seq.map int
    |> Seq.chunkBySize 3
    |> Seq.map (fun c -> { X = c[0]; Y = c[1] }, c[2])

let parseOutput instructions =
    let scores, tiles =
        instructions
        |> toTiles
        |> Seq.toList
        |> List.partition (fun (pos, tile) -> pos.X = -1 && pos.Y = 0)

    scores |> Seq.tryLast |> Option.map snd, tiles

let tileCount tile =
    Map.toSeq >> Seq.countBy snd >> Seq.find (fun (k, _) -> k = tile) >> snd

let addToMap = Seq.fold (fun acc (key, value) -> Map.add key value acc)

let play (computer: IntCode.Computer) =
    let mutable score = 0
    let mutable tiles = Map.empty

    let playCommands commands =
        let newScore, newTiles = computer.run commands |> parseOutput

        match newScore with
        | Some newScore -> score <- newScore
        | None -> ()

        tiles <- addToMap tiles newTiles

    playCommands [||]

    while not computer.isHalted do
        let ball = tiles |> Map.findKey (fun _ v -> v = 4)
        let paddle = tiles |> Map.findKey (fun _ v -> v = 3)

        let direction = sign (ball.X - paddle.X)

        playCommands [| direction |]

    score

let solve (input: string array) =
    let program = IntCode.parseProgram input[0]

    let modified = program |> Array.copy
    modified.[0] <- 2

    let result1 =
        IntCode.Computer program |> fun c -> c.run [||] |> toTiles |> Map |> tileCount 2

    let result2 = IntCode.Computer modified |> play

    result1, result2, 355, 18371

DayUtils.runDay solve
