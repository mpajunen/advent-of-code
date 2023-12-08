#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"

let parseRow (row: string) = row[0..2], (row[7..9], row[12..14])

let travel (dirs: string) (nodes: Map<string, string * string>) start stops =
    let mutable current = start
    let mutable steps = 0

    while not <| List.contains current stops do
        let dir = dirs[steps % (String.length dirs)]

        current <- nodes[current] |> if dir = 'L' then fst else snd
        steps <- steps + 1

    steps

let rec gcd a b = if b = 0L then a else gcd b (a % b)

let lcm a b = a * b / (gcd a b)

let ghostTravel (dirs: string) (nodes: Map<string, string * string>) =
    let starts = Map.keys nodes |> Seq.filter (fun k -> k[2] = 'A')
    let stops = Map.keys nodes |> Seq.filter (fun k -> k[2] = 'Z') |> Seq.toList

    let startStops start = travel dirs nodes start stops

    starts |> Seq.map startStops |> Seq.map int64 |> Seq.reduce lcm

let solve (input: string array) =
    let dirs = input[0]
    let nodes = input[2..] |> Array.map parseRow |> Map

    let result1 = travel dirs nodes "AAA" ["ZZZ"]
    let result2 = ghostTravel dirs nodes

    result1, result2, 13301, 7309459565207L

DayUtils.runDay solve
