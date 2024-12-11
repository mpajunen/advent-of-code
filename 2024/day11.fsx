#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Func.fs"
#load "../fs-common/Input.fs"

let blinkOnce n =
    if n = 0L then
        [ 1L ]
    else
        let digits = string n
        let len = digits.Length

        if len % 2 = 0 then
            [ int64 digits[0 .. len / 2 - 1]; int64 digits[len / 2 ..] ]
        else
            [ n * 2024L ]

let countStone recur blinks stone =
    if blinks = 0L then
        1L
    else
        stone |> blinkOnce |> List.sumBy (recur (blinks - 1L))

let countStones = Func.memoize2 countStone >> List.sumBy // :)

DayUtils.runDay (fun input ->
    let initial = input[0] |> Input.parseAllLongs

    let result1 = initial |> countStones 25
    let result2 = initial |> countStones 75

    result1, result2, 199986L, 236804088748754L)
