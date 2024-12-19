#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Func.fs"

let getOptionCount' recur (patterns: string[]) =
    function
    | "" -> 1L
    | (design: string) ->
        patterns
        |> Array.sumBy (fun pattern ->
            if design.StartsWith pattern then
                design[pattern.Length ..] |> recur patterns
            else
                0L)

let getOptionCount = Func.memoizeRec2 getOptionCount'

DayUtils.runDay (fun input ->
    let patterns = input[0].Split ", "
    let designs = input[2..]

    let counts = designs |> Array.map (getOptionCount patterns)

    let result1 = counts |> Array.filter (fun c -> c > 0) |> Array.length
    let result2 = counts |> Array.sum

    result1, result2, 247, 692596560138745L)
