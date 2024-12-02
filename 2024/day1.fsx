#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Input.fs"

let countOf value =
    Map.tryFind value >> Option.defaultValue 0

let solve (input: string array) =
    let numbers = input |> Array.map Input.parseAllInts |> array2D

    let left = numbers[*, 0] |> Array.sort
    let right = numbers[*, 1] |> Array.sort

    let rightCounts = right |> Array.countBy id |> Map

    let result1 = Array.zip left right |> Array.sumBy (fun (l, r) -> abs (r - l))
    let result2 = left |> Array.sumBy (fun l -> l * countOf l rightCounts)

    result1, result2, 2742123, 21328497

DayUtils.runDay solve
