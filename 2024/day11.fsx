#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Func.fs"
#load "../fs-common/Input.fs"

let getDigitCount =
    function
    | 0L -> 1
    | n -> n |> float |> log10 |> floor |> int |> (+) 1

let blinkOnce n =
    match n, getDigitCount n with
    | _, digitCount when digitCount % 2 = 0 ->
        let divisor = pown 10L (digitCount / 2)

        [ n / divisor; n % divisor ]
    | 0L, _ -> [ 1L ]
    | _ -> [ n * 2024L ]

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
