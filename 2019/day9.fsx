#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "./IntCode.fs"

let solve (input: string array) =
    let program = IntCode.parseProgram input[0]

    let result1 = IntCode.run program [|1|] |> Array.last
    let result2 = IntCode.run program [|2|] |> Array.last

    result1, result2, 3989758265L, 76791L

DayUtils.runDay solve
