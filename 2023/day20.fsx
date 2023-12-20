#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"

open System.Collections.Generic

type ModuleKind =
    | Untyped
    | FlipFlop
    | Conjunction

type Module = ModuleKind * string list

let parseModule (s: string) =
    let parts = s.Split(" -> ")

    let kind, name =
        match parts[0][0] with
        | '%' -> FlipFlop, parts[0][1..]
        | '&' -> Conjunction, parts[0][1..]
        | _ -> Untyped, parts[0]

    let outputs = parts[1].Split(", ") |> Array.toList

    name, (kind, outputs)

let defaultModules = [| "output", (Untyped, []); "rx", (Untyped, []) |]

let buildState (modules: Map<string, Module>) =
    let inputs = Dictionary()
    let sentValues = Dictionary()
    let pulseCounts = Dictionary()

    pulseCounts[false] <- 0
    pulseCounts[true] <- 0

    for m in modules do
        sentValues[m.Key] <- false
        inputs[m.Key] <- []

    for m in modules do
        for out in snd m.Value do
            inputs[out] <- m.Key :: inputs[out]

    inputs, sentValues, pulseCounts

let pushRepeatedly limit (modules: Map<string, Module>) =
    let inputs, sentValues, pulseCounts = buildState modules

    let getInputValues name =
        inputs[name] |> List.map (fun k -> sentValues[k])

    let processPulse isHigh name =
        pulseCounts[isHigh] <- pulseCounts[isHigh] + 1

        let outputs, sendHigh =
            match modules[name] with
            | Untyped, outputs -> outputs, isHigh
            | FlipFlop, outputs ->
                if not isHigh then
                    outputs, not sentValues[name]
                else
                    [], sentValues[name]
            | Conjunction, outputs -> outputs, getInputValues name |> Seq.exists ((=) false)

        sentValues[name] <- sendHigh

        outputs |> List.map (fun output -> sendHigh, output)

    for _ in { 1..limit } do
        let mutable pulses = [ false, "broadcaster" ]

        while pulses.Length > 0 do
            pulses <- pulses[0] ||> processPulse |> List.append pulses[1..]

    pulseCounts

let solve (input: string array) =
    let modules = input |> Array.map parseModule |> Array.append defaultModules |> Map

    let pulseCounts = pushRepeatedly 1000 modules

    let result1 = pulseCounts[false] * pulseCounts[true]
    let result2 = 0

    result1, result2, 841763884, 0

DayUtils.runDay solve
