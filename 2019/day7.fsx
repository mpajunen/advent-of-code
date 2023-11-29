#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "./IntCode.fs"

let rec permute list =
    match list with
    | [] -> [ [] ]
    | _ ->
        list
        |> List.collect (fun x -> permute (List.filter (fun y -> y <> x) list) |> List.map (fun y -> x :: y))

let createAmp program setting =
    let amp = IntCode.Computer program
    amp.run [| setting |] |> ignore

    amp

let runStep state (amp: IntCode.Computer) = amp.run [| state |] |> Array.last

let runPermutation program settings =
    let amps = List.map (createAmp program) settings

    let mutable state = 0

    while not amps[0].isHalted do
        state <- List.fold runStep state amps

    state

let solve (input: string array) =
    let program = IntCode.parseProgram input[0]

    let findMax settings =
        Seq.toList settings |> permute |> List.map (runPermutation program) |> List.max

    let result1 = findMax { 0..4 }
    let result2 = findMax { 5..9 }

    result1, result2, 30940, 76211147

DayUtils.runDay solve
