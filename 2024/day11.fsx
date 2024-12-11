#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Input.fs"

open System.Collections.Generic

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

let countStones totalBlinks initialStones =
    let cache = Dictionary()

    let rec countStone blinks (stone: int64) =
        if blinks = 0L then
            1L
        else
            if not <| cache.ContainsKey(blinks, stone) then
                cache[(blinks, stone)] <- stone |> blinkOnce |> List.sumBy (countStone (blinks - 1L))

            cache[(blinks, stone)]

    initialStones |> List.sumBy (countStone totalBlinks)

DayUtils.runDay (fun input ->
    let initial = input[0] |> Input.parseAllLongs

    let result1 = initial |> countStones 25
    let result2 = initial |> countStones 75

    result1, result2, 199986L, 236804088748754L)
