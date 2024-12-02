#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Input.fs"
#load "./Assembunny.fs"

open Assembunny

let init initialA =
    initialRegisters |> Map.add "a" initialA |> initialState

let solve (input: string array) =
    let instructions = input |> Array.map parseInstruction

    let result1 = instructions |> init 7 |> exec |> (fun registers -> registers["a"])
    let result2 = 0

    result1, result2, 10223, 0

DayUtils.runDay solve
