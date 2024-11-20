#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"

let scanSums numbers = (Array.scan (+) 0 numbers)[1..]

let findFirstFast (numbers: int array) =
    let mutable current = 0
    let mutable found = Set.empty

    while not (Set.contains current found) do
        found <- Set.add current found

        let index = Set.count found % numbers.Length
        current <- current + numbers.[index]

    current

let solve (input: string array) =
    let numbers = input |> Array.map int

    let rollingSums = numbers |> scanSums

    let result1 = rollingSums |> Array.last
    let result2 = numbers |> findFirstFast

    result1, result2, 400, 232

DayUtils.runDay solve
