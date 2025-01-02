module Year2024.Day11

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

let countStone recur =
    function
    | 0 -> fun _ -> 1L
    | blinks -> blinkOnce >> List.sumBy (recur (blinks - 1))

let countStones = Func.memoizeRec2 countStone >> List.sumBy // :)

let solve =
    DayUtils.solveDay (fun input ->
        let initial = input[0] |> Input.parseAllLongs

        let result1 = initial |> countStones 25
        let result2 = initial |> countStones 75

        result1, result2, 199986L, 236804088748754L)
