module Year2025.Day11

let parseRow (row: string) =
    let parts = row.Split ": "

    parts[0], parts[1].Split " "

let rec getOutPathCount paths =
    function
    | "out" -> 1
    | current -> Map.find current paths |> Array.sumBy (getOutPathCount paths)

let solve =
    DayUtils.solveDay (fun input ->
        let paths = input |> Array.map parseRow |> Map.ofArray

        let result1 = getOutPathCount paths "you"
        let result2 = 0

        result1, result2, 696, 0)
