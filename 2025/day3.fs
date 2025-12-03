module Year2025.Day3

let parseBank (row: string) =
    row.ToCharArray() |> Array.map (fun c -> int64 c - int64 '0') |> Array.toList

let rec updateSelection value =
    function
    | a :: rest when value >= a -> value :: updateSelection a rest
    | all -> all

let selectBatteries count (bank: int64 list) =
    List.splitAt (bank.Length - count) bank ||> List.foldBack updateSelection

let totalJoltage = List.reduce (fun acc x -> acc * 10L + x)

let solve =
    DayUtils.solveDay (fun input ->
        let banks = input |> Array.map parseBank

        let result1 = banks |> Array.sumBy (selectBatteries 2 >> totalJoltage)
        let result2 = banks |> Array.sumBy (selectBatteries 12 >> totalJoltage)

        result1, result2, 17087L, 169019504359949L)
