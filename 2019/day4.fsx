#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"

let getDigits (candidate: int) =
    candidate.ToString() |> Seq.map (string >> int)

let areDigitsIncreasing (digits: int seq) =
    Seq.reduce (fun previous digit -> if digit >= previous then digit else 999) digits < 10

let hasSameDigits (countCheck: int -> bool) (digits: int seq) =
    Seq.countBy id digits |> Seq.map snd |> Seq.exists countCheck

let solve (input: string array) =
    let limits = input[0].Split "-" |> Array.map int

    let increasing =
        { limits[0] .. limits[1] } |> Seq.map getDigits |> Seq.where areDigitsIncreasing

    let result1 =
        increasing |> Seq.where (hasSameDigits (fun n -> n >= 2)) |> Seq.length

    let result2 = increasing |> Seq.where (hasSameDigits (fun n -> n = 2)) |> Seq.length

    result1, result2, 945, 617

DayUtils.runDay solve
