#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Vec2.fs"

open Vec2

let findKeys predicate =
    Seq.indexed >> Seq.filter (snd >> predicate) >> Seq.map fst

let getColumnLoad col =
    col |> findKeys ((=) 'O') |> Seq.sumBy (fun index -> Seq.length col - index)

let rec slideLine spaces tail =
    match Array.tryHead tail with
    | None -> spaces
    | Some '#' -> spaces @ [ '#' ] @ slideLine [] tail[1..]
    | Some 'O' -> [ 'O' ] @ slideLine spaces tail[1..]
    | Some '.' -> slideLine (spaces @ [ '.' ]) tail[1..]
    | _ -> failwith "Invalid line!"

// Take columns, reverse each, use as rows -> clockwise rotation
let cycleDir = Grid.cols >> Array.map (slideLine [] >> List.rev) >> array2D

let spinCycle = cycleDir >> cycleDir >> cycleDir >> cycleDir

let rec cycleUntilLoop earlier current =
    if earlier |> List.contains current then
        earlier @ [ current ]
    else
        current |> spinCycle |> cycleUntilLoop (earlier @ [ current ])

let findNth n states =
    let startIndex = List.findIndex ((=) (List.last states)) states
    let cycleLength = (states.Length - 1) - startIndex
    let targetIndex = (n - startIndex) % cycleLength + startIndex

    states[targetIndex]

let findCycled = cycleUntilLoop [] >> findNth 1000000000

let solve (input: string array) =
    let grid = input |> Grid.fromRows

    let result1 = grid |> Grid.cols |> Array.sumBy (slideLine [] >> getColumnLoad)
    let result2 = grid |> findCycled |> Grid.cols |> Array.sumBy getColumnLoad

    result1, result2, 108826, 99291

DayUtils.runDay solve
