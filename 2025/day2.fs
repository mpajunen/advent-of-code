module Year2025.Day2

let parseRanges (row: string) =
    row.Split ',' |> Array.map (fun s -> s.Split '-' |> Array.map int64)

let getInvalid parts (range: int64[]) =
    let rec findInvalid x =
        match x |> string |> String.replicate parts |> int64 with
        | candidate when candidate > range[1] -> []
        | candidate when candidate < range[0] -> findInvalid (x + 1)
        | candidate -> candidate :: findInvalid (x + 1)

    findInvalid 1

let getAllInvalid (range: int64[]) =
    [ 2 .. (string range[1]).Length ]
    |> List.collect (fun parts -> getInvalid parts range)
    |> List.distinct

let solve =
    DayUtils.solveDay (fun input ->
        let ranges = input[0] |> parseRanges

        let result1 = ranges |> Array.sumBy (getInvalid 2 >> List.sum)
        let result2 = ranges |> Array.sumBy (getAllInvalid >> List.sum)

        result1, result2, 023534117921L, 31755323497L)
