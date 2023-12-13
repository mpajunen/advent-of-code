#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Vec2.fs"

open Vec2

let rec split splitter (input: 'a array) =
    match Array.tryFindIndex splitter input with
    | Some n -> input[.. n - 1] :: split splitter input[n + 1 ..]
    | None -> [ input ]

let diffLines pair =
    pair ||> Array.map2 (fun a b -> if a <> b then 1 else 0) |> Array.sum

let diffSides sides =
    sides ||> Array.zip |> Array.sumBy diffLines

let splitSides lines index =
    let a, b = lines |> Array.splitAt index
    let size = min a.Length b.Length

    a[a.Length - size ..], b[.. size - 1] |> Array.rev

let tryFindLine difference (lines: char array array) =
    { 1 .. lines.Length - 1 }
    |> Seq.tryFind (splitSides lines >> diffSides >> (=) difference)

let findCandidates difference pattern =
    pattern |> Grid.rows |> tryFindLine difference, pattern |> Grid.cols |> tryFindLine difference

let summarize =
    function
    | Some row, _ -> row * 100
    | _, Some col -> col
    | _ -> failwith <| sprintf "Reflection line not found"

let solve (input: string array) =
    let patterns = input |> split ((=) "") |> List.map Grid.fromRows

    let result1 = patterns |> List.sumBy (findCandidates 0 >> summarize)
    let result2 = patterns |> List.sumBy (findCandidates 1 >> summarize)

    result1, result2, 33047, 28806

DayUtils.runDay solve
