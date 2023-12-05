#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"

open System.Text.RegularExpressions

let extractMatches pattern (y, row) =
    Regex.Matches(row, pattern) |> Seq.map (fun m -> (y, m.Index), m)

let allSymbolPositions (y0, x0) (m: Match) =
    seq { for y in y0 - 1 .. y0 + 1 do for x in x0 - 1 .. x0 + m.Length -> (y, x) }

let buildPartNumbers input =
    let allRows = input |> Array.indexed
    let symbols = allRows |> Seq.collect (extractMatches @"[^\d^.]") |> Map
    let allNumbers = allRows |> Seq.collect (extractMatches @"\d+")

    let partNumber (basePosition, number: Match) =
        allSymbolPositions basePosition number
        |> Seq.tryFind (fun p -> Map.containsKey p symbols)
        |> Option.map (fun p ->
            {| SymbolPosition = p
               Number = int number.Value
               Symbol = (Map.find p symbols).Value |})

    allNumbers |> Seq.choose partNumber

let product = Seq.fold (*) 1

let solve (input: string array) =
    let partNumbers = input |> buildPartNumbers

    let result1 = partNumbers |> Seq.sumBy _.Number

    let result2 =
        partNumbers
        |> Seq.filter (fun n -> n.Symbol = "*")
        |> Seq.groupBy _.SymbolPosition
        |> Seq.map snd
        |> Seq.filter (fun n -> Seq.length n = 2)
        |> Seq.sumBy (Seq.map _.Number >> product)

    result1, result2, 550934, 81997870

DayUtils.runDay solve
