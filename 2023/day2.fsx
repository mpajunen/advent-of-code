#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"

type Game =
    { Id: int
      Grabs: (int * string) array array }

let parseGrabColor (s: string) =
    s.Split " " |> fun parts -> int parts[0], parts[1]

let parseGrab (grab: string) =
    grab.Split ", " |> Array.map parseGrabColor

let parseGame (row: string) : Game =
    let parts = row.Split ": "

    { Id = parts[0][5..] |> int
      Grabs = parts[1].Split "; " |> Array.map parseGrab }

let maxGrabs = Map [ ("red", 12); ("green", 13); ("blue", 14) ]

let isPossibleGrab (count, color) = count <= maxGrabs[color]

let isPossibleGame (game: Game) =
    game.Grabs |> Array.collect id |> Array.forall isPossibleGrab

let getGamePower (game: Game) =
    game.Grabs
    |> Array.collect id
    |> Array.groupBy (fun (_, color) -> color)
    |> Array.map (snd >> Array.map fst >> Array.max)
    |> Array.fold (*) 1

let solve (input: string array) =
    let games = input |> Array.map parseGame

    let result1 = games |> Array.filter isPossibleGame |> Array.sumBy (fun g -> g.Id)
    let result2 = games |> Array.sumBy getGamePower

    result1, result2, 2105, 72422

DayUtils.runDay solve
