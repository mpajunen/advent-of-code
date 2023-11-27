#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "./IntCode.fs"

let solve (input: string array) =
    let program = input[0].Split "," |> Array.map int

    let result1 = IntCode.run program [|1|] |> Array.last
    let result2 = IntCode.run program [|5|] |> Array.last

    result1, result2

DayUtils.runDay solve
