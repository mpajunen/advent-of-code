#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"

open System.Collections.Generic

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
    let noGroupNext =
        function
        | "", [] -> 1L
        | "", _ -> 0L
        | conditions, groups ->
            if conditions[0] <> '#' then
                countArrangements (conditions[1..], groups)
            else
                0L

    let groupNext =
        function
        | _, [] -> 0L
        | "", _ -> 0L
        | conditions, size :: remaining ->
            let candidate = conditions[.. size - 1]

            if conditions.Length >= size && String.forall ((<>) '.') candidate then
                noGroupNext (conditions[size..], remaining)
            else
                0L

    groupNext row + noGroupNext row

let solve (input: string array) =
    let result1 = input |> Array.sumBy (parseRow >> countArrangements)
    let result2 = input |> Array.sumBy (parseRow >> unfold >> countArrangements)

    result1, result2, 6488L, 815364548481L

DayUtils.runDay solve
