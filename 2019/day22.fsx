#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"

type Technique =
    | Cut of int64
    | Deal of int64
    | Reverse

let parseTechnique (row: string) : Technique =
    let parts = row.Split(' ')

    match parts[0], parts[1] with
    | "cut", _ -> Cut(int64 parts[1])
    | "deal", "into" -> Reverse
    | "deal", "with" -> Deal(int64 parts[3])
    | _ -> failwith "Unknown shuffle"

let modulo a b = (a % b + b) % b

let findIndexAfterTechnique cardCount n =
    function
    | Cut m -> modulo (n - m) cardCount
    | Deal m -> modulo (n * m) cardCount
    | Reverse -> modulo (n * -1L - 1L) cardCount

let solve (input: string array) =
    let techniques = input |> Array.map parseTechnique |> Array.toList

    let result1 = techniques |> List.fold (findIndexAfterTechnique 10_007L) 2019L
    let result2 = 0

    result1, result2, 6978L, 0

DayUtils.runDay solve
