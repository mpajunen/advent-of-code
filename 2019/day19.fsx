#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Vec2.fs"
#load "./IntCode.fs"

open Vec2

let AREA_SIZE = 50
let SHIP_SIZE = 100

let createScanner program y x =
    IntCode.run program [| int64 x; int64 y |] |> Seq.last |> int

let scanArea scan =
    Array.init AREA_SIZE (scan >> Array.init AREA_SIZE)

let canLandOn scan p =
    scan (p.Y + SHIP_SIZE - 1) p.X = 1 && scan p.Y (p.X + SHIP_SIZE - 1) = 1

let coneHeading scanResult =
    let grid =
        scanResult |> Array.map (Array.map string >> String.concat "") |> Grid.fromRows

    let targetX = grid |> Grid.rows |> Seq.last |> Seq.findIndex (fun x -> x = '1')

    let targetY =
        grid
        |> Grid.rows
        |> Seq.indexed
        |> Seq.find (fun (y, row) ->
            let index = targetX + (AREA_SIZE - y)

            index < AREA_SIZE && row[index] = '1')
        |> fst

    { X = targetX; Y = targetY }

let rec findUpperLimit scan v =
    if canLandOn scan v then
        v
    else
        findUpperLimit scan { X = v.X * 2; Y = v.Y * 2 }

let rec findLimit scan lower upper =
    let middle =
        { X = (lower.X + upper.X) / 2
          Y = (lower.Y + upper.Y) / 2 }

    if lower = middle then
        middle
    else if canLandOn scan middle then
        findLimit scan lower middle
    else
        findLimit scan middle upper

let rec findFinal scanner current =
    let next =
        [ { X = -1; Y = -1 }; { X = 0; Y = -1 }; { X = -1; Y = 0 } ]
        |> List.map ((+) current)
        |> List.tryFind (canLandOn scanner)

    match next with
    | Some p -> findFinal scanner p
    | None -> current

let findLandingPosition scanner scanResult =
    let upperLimit = scanResult |> coneHeading |> findUpperLimit scanner
    let limit = findLimit scanner Vec2.origin upperLimit

    findFinal scanner limit

let solve (input: string array) =
    let scan = IntCode.parseProgram input[0] |> createScanner

    let scanResult = scanArea scan

    let result1 = scanResult |> Seq.collect id |> Seq.sum
    let result2 = scanResult |> findLandingPosition scan |> (fun l -> l.X * 10000 + l.Y)

    result1, result2, 203, 8771057

DayUtils.runDay solve
