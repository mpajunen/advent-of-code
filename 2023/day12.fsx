#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"

open System.Collections.Generic

let firstChar s =
    if String.length s = 0 then None else Some s[0]

let parseRow (row: string) =
    let parts = row.Split " "

    parts[0], parts[1].Split "," |> Array.map int |> Array.toList

let unfold (conditions, groups) =
    conditions |> List.replicate 5 |> String.concat "?", groups |> List.replicate 5 |> List.concat

let cache = Dictionary()

let rec countArrangements row =
    match cache.TryGetValue(row) with
    | true, count -> count
    | _ ->
        let count = countArrangementsNext row

        cache.[row] <- count

        count

and countArrangementsNext row =
    let noGroupNext (conditions, groups) =
        match firstChar conditions, groups with
        | None, [] -> 1L
        | None, _ -> 0L
        | Some '#', _ -> 0L
        | _ -> countArrangements (conditions[1..], groups)

    let rec groupNext (conditions, groups) =
        match firstChar conditions, groups with
        | _, [] -> 0L
        | None, _ -> 0L
        | Some '.', _ -> 0L
        | _, 1 :: remaining -> noGroupNext (conditions[1..], remaining)
        | _, size :: remaining -> groupNext (conditions[1..], size - 1 :: remaining)

    groupNext row + noGroupNext row

let solve (input: string array) =
    let result1 = input |> Array.sumBy (parseRow >> countArrangements)
    let result2 = input |> Array.sumBy (parseRow >> unfold >> countArrangements)

    result1, result2, 6488L, 815364548481L

DayUtils.runDay solve
