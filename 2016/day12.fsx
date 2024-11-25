#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Input.fs"
#load "./Assembunny.fs"

let solve (input: string array) =
    let inp = input |> Array.map Assembunny.parseInstruction

    let result1 = inp |> Assembunny.execute |> (fun registers -> registers["a"])
    let result2 = 0

    result1, result2, 317993, 0

DayUtils.runDay solve
