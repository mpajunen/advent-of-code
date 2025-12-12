module Year2025.Day11

let parseRow (row: string) =
    let parts = row.Split ": "

    parts[0], parts[1].Split " "

let rec getOutPathCount paths =
    function
    | "out" -> 1
    | current -> Map.find current paths |> Array.sumBy (getOutPathCount paths)

let getDevicePathCount paths =
    let getCount recur (dac, fft) =
        function
        | "out" -> if dac && fft then 1L else 0L
        | current ->
            let newDac, newFft = dac || current = "dac", fft || current = "fft"

            Map.find current paths |> Array.sumBy (recur (newDac, newFft))

    let getCountMemo = Func.memoizeRec2 getCount

    getCountMemo (false, false)

let solve =
    DayUtils.solveDay (fun input ->
        let paths = input |> Array.map parseRow |> Map.ofArray

        let result1 = getOutPathCount paths "you"
        let result2 = getDevicePathCount paths "svr"

        result1, result2, 696, 473741288064360L)
