#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Hash.fs"
#load "../fs-common/Vec2.fs"

open Vec2

type State =
    { Passcode: string
      Position: Vec
      Path: string }

let getInitial passcode =
    { Passcode = passcode
      Position = Vec2.origin
      Path = "" }

let goal = { X = 3; Y = 3 }

let directions = [ 'U'; 'D'; 'L'; 'R' ]

let isDoorOpen c = c >= 'b' && c <= 'f'

let isWithinGrid p =
    p.X >= 0 && p.X < 4 && p.Y >= 0 && p.Y < 4

let getOpenDoors s =
    let hash = Hash.md5 (s.Passcode + s.Path)

    [ 0 .. directions.Length - 1 ]
    |> List.choose (fun i -> if isDoorOpen hash[i] then Some directions[i] else None)

let getNextStates state =
    let dirs = state |> getOpenDoors
    let positions = dirs |> List.map (Move.findDir >> (+) state.Position)

    List.zip dirs positions
    |> List.filter (snd >> isWithinGrid)
    |> List.map (fun (dir, position) ->
        { state with
            Position = position
            Path = state.Path + string dir })

let rec findShortestPath states =
    match states |> Seq.tryFind (_.Position >> (=) goal) with
    | Some s -> s.Path
    | None -> states |> Seq.collect getNextStates |> findShortestPath

let rec findLongestPath state =
    if state.Position = goal then
        state.Path.Length
    else
        match state |> getNextStates with
        | [] -> -1
        | next -> next |> Seq.map findLongestPath |> Seq.max

let solve (input: string array) =
    let result1 = [ input[0] |> getInitial ] |> findShortestPath
    let result2 = input[0] |> getInitial |> findLongestPath

    result1, result2, "RDDRULDDRR", 766

DayUtils.runDay solve
