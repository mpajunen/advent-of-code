#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Vec2.fs"
#load "./IntCode.fs"

open Vec2

type Tile =
    | Empty
    | Wall
    | Oxygen
    | Droid
    | Unknown

let drawTile tile =
    match tile with
    | Tile.Empty -> "."
    | Tile.Wall -> "#"
    | Tile.Oxygen -> "O"
    | Tile.Droid -> "D"
    | Tile.Unknown -> " "

let draw tiles =
    tiles |> Grid.fromSparseMap Unknown |> Array2D.map drawTile |> Grid.toString

let debugPrint tiles droid =
    tiles |> Map.add droid Droid |> draw |> printfn "%s\n"

let dirCommand dir =
    match dir with
    | Vec2.Up -> 1
    | Vec2.Down -> 2
    | Vec2.Left -> 3
    | Vec2.Right -> 4

let opposite dir =
    match dir with
    | Vec2.Up -> Vec2.Down
    | Vec2.Down -> Vec2.Up
    | Vec2.Left -> Vec2.Right
    | Vec2.Right -> Vec2.Left

let allDirections = [ Vec2.Up; Vec2.Down; Vec2.Left; Vec2.Right ]

let explore program =
    let computer = IntCode.Computer program

    let mutable droidPosition = Vec2.origin
    let mutable tiles = Map [ (droidPosition, Empty) ]
    let mutable moves = []

    let inDirection position dir =
        Map.tryFind (position + dir) tiles

    let tryMoveTo dir =
        let out = computer.run [| dirCommand dir |]

        let position = droidPosition + dir
        let tile =
            match out[0] with
            | 0L -> Wall
            | 1L -> Empty
            | 2L -> Oxygen
            | _ -> failwith <| sprintf $"Invalid tile {out[0]}!"

        tiles <- Map.add position tile tiles

        if tile <> Wall then
            droidPosition <- position
            moves <- dir :: moves

    let moveBack () =
        let dir = opposite moves.Head

        computer.run [| dirCommand dir |] |> ignore

        droidPosition <- droidPosition + dir
        moves <- moves.Tail

    let rec explore_ () =
        let next =
            allDirections |> List.tryFind (fun dir -> inDirection droidPosition dir = None)

        match next with
        | Some dir ->
            tryMoveTo dir
            explore_ ()
        | None ->
            if moves.IsEmpty then
                ()
            else
                moveBack ()
                explore_ ()

    explore_ ()

    tiles

let oxygenDistances tiles =
    let oxygenPosition = Map.findKey (fun k v -> v = Oxygen) tiles

    let mutable distances = Map [ (oxygenPosition, 0) ]

    let rec buildDistances position =
        let distance = Map.find position distances + 1

        let adjacentPositions =
            Move.adjacent position
            |> List.filter (fun p -> Map.find p tiles <> Wall)

        let next =
            adjacentPositions
            |> List.filter (fun p -> Map.tryFind p distances |> Option.defaultValue 999_999 > distance)

        next |> List.iter (fun p -> distances <- Map.add p distance distances)

        next |> List.iter buildDistances

    buildDistances oxygenPosition

    distances

let solve (input: string array) =
    let program = IntCode.parseProgram input[0]

    let distances = explore program |> oxygenDistances

    let result1 = distances |> Map.find origin
    let result2 = distances |> Map.values |> Seq.max

    result1, result2, 272, 398

DayUtils.runDay solve
