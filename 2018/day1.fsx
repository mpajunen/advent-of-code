#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"

let scanSums = Array.scan (+) 0 >> Array.tail

let rec findFirstDuplicate cycle rollingSums =
    let offset = Array.last rollingSums * cycle

    let duplicate =
        rollingSums
        |> Array.map ((+) offset)
        |> Array.tryFind (fun x -> Array.contains x rollingSums)

    match duplicate with
    | Some x -> x
    | None -> findFirstDuplicate (cycle + 1) rollingSums

let solve (input: string array) =
    let numbers = input |> Array.map int

    let rollingSums = numbers |> scanSums

    let result1 = rollingSums |> Array.last
    let result2 = rollingSums |> findFirstDuplicate 1

    result1, result2, 400, 232

DayUtils.runDay solve
