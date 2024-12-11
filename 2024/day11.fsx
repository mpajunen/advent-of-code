#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Func.fs"
#load "../fs-common/Input.fs"

let getDigitCount =
    function
    | 0L -> 1
    | n -> n |> float |> log10 |> floor |> int |> (+) 1

let blinkStone n =
    match n, getDigitCount n with
    | _, digitCount when digitCount % 2 = 0 ->
        let divisor = pown 10L (digitCount / 2)

        [ n / divisor; n % divisor ]
    | 0L, _ -> [ 1L ]
    | _ -> [ n * 2024L ]

let blinkOnce =
    List.collect (fun (stone, count) -> stone |> blinkStone |> List.map (fun s -> s, count))
    >> List.groupBy fst
    >> List.map (fun (stone, counts) -> stone, counts |> List.sumBy snd)

let rec countStones =
    function
    | 0 -> List.sumBy snd
    | blinks -> blinkOnce >> countStones (blinks - 1)

DayUtils.runDay (fun input ->
    let initial = input[0] |> Input.parseAllLongs |> List.map (fun x -> x, 1L)

    let result1 = initial |> countStones 25
    let result2 = initial |> countStones 75

    result1, result2, 199986L, 236804088748754L)
