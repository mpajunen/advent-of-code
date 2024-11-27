#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Input.fs"

let invertChar =
    function
    | '0' -> '1'
    | '1' -> '0'
    | _ -> failwith "Invalid character."

let rec charAt (initial: string) patternLength index =
    if index < initial.Length then
        initial[index]
    else
        let prevLength = (patternLength - 1) / 2

        match compare index prevLength with
        | 0 -> '0'
        | -1 -> charAt initial prevLength index
        | 1 -> charAt initial prevLength (patternLength - 1 - index) |> invertChar
        | _ -> failwith "Invalid comparison."

let checksumN fillLength (initial: string) =
    let rec checksumChar checkLength index =
        if checkLength >= fillLength then
            charAt initial checkLength index
        else
            let a = checksumChar (checkLength * 2 + 1) (index * 2)
            let b = checksumChar (checkLength * 2 + 1) (index * 2 + 1)

            if a = b then '1' else '0'

    { 0 .. initial.Length - 1 }
    |> Seq.map (checksumChar initial.Length >> string)
    |> String.concat ""

let solve (input: string array) =
    let result1 = input[0] |> checksumN 272
    let result2 = input[0] |> checksumN 35651584

    result1, result2, "11111000111110000", "10111100110110100"

DayUtils.runDay solve
