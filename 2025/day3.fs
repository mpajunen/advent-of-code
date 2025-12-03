module Year2025.Day3

let rec updateSelection value =
    function
    | a :: rest when value >= a -> value :: updateSelection a rest
    | all -> all

let getBatteries count (bank: char list) =
    List.splitAt (bank.Length - count) bank ||> List.foldBack updateSelection

let totalJoltage = List.fold (fun acc c -> acc * 10L + int64 c - int64 '0') 0L

let solve =
    DayUtils.solveDay (fun input ->
        let result1 = input |> Array.sumBy (Seq.toList >> getBatteries 2 >> totalJoltage)
        let result2 = input |> Array.sumBy (Seq.toList >> getBatteries 12 >> totalJoltage)

        result1, result2, 17087L, 169019504359949L)
