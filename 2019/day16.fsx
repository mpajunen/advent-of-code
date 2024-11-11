#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"

let basePattern = [0; 1; 0; -1]

let fft input =
    let digit index _ =
        let indexVal vIndex v =
            (v * basePattern[(vIndex + 1) / (index + 1) % basePattern.Length])

        input |> Array.mapi indexVal |> Array.sum |> (fun n -> abs n % 10)

    input |> Array.mapi digit

// Assume offset > repeated length / 2
let simplifiedFft input =
    Array.scanBack (fun a b -> (a + b) % 10) input 0

let repeatTransform transform initial =
    seq { 1..100 } |> Seq.fold (fun a _ -> transform a) initial

let getMessage (output: int[]) =
    output[..7] |> Array.map string |> String.concat ""

let solve (input: string array) =
    let digits = input[0] |> Seq.toArray |> Array.map (string >> int)

    let offset = input[0][..6] |> int
    let repeated = Array.replicate 10_000 digits |> Array.concat

    let result1 = digits |> repeatTransform fft |> getMessage
    let result2 = repeated[offset..] |> repeatTransform simplifiedFft |> getMessage

    result1, result2, "69549155", "83253465"

DayUtils.runDay solve
