#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Input.fs"

type Operation =
    | And
    | Or
    | Xor

type Gate = { A: string; Op: Operation; B: string }

let parseInitial =
    function
    | Input.ParseRegex "(\w+): (\d+)" [ name; value ] -> name, int value
    | s -> failwith $"Invalid initialization {s}"

let parseOperation =
    function
    | "AND" -> And
    | "OR" -> Or
    | "XOR" -> Xor
    | s -> failwith $"Invalid operation {s}"

let operate =
    function
    | And -> (&&&)
    | Or -> (|||)
    | Xor -> (^^^)

let parseGate =
    function
    | Input.ParseRegex "(\w+) (\w+) (\w+) -> (\w+)" [ a; op; b; out ] -> out, { A = a; Op = parseOperation op; B = b }
    | s -> failwith $"Invalid gate {s}"

let getOutGates =
    Map.keys >> Seq.filter (fun (k: string) -> k.StartsWith "z") >> Seq.toList

let toDecimal = List.mapi (fun i b -> (int64 b) <<< i) >> List.sum

let findOutput (initial: Map<string, int>) (gates: Map<string, Gate>) =
    let rec findVal name =
        if initial.ContainsKey name then
            initial[name]
        else
            operate gates[name].Op (findVal gates[name].A) (findVal gates[name].B)

    gates |> getOutGates |> List.map findVal |> toDecimal

DayUtils.runDay (fun input ->
    let splitAt = input |> Array.findIndex ((=) "")
    let initial = input[0 .. splitAt - 1] |> Array.map parseInitial |> Map
    let gates = input[splitAt + 1 ..] |> Array.map parseGate |> Map

    let result1 = findOutput initial gates
    let result2 = 0

    result1, result2, 55114892239566L, 0)
