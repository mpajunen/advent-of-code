#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"

type Technique =
    | Cut of int
    | Deal of int
    | Reverse

let parseTechnique (row: string) : Technique =
    let parts = row.Split(' ')

    match parts[0], parts[1] with
    | "cut", _ -> Cut(int parts[1])
    | "deal", "into" -> Reverse
    | "deal", "with" -> Deal(int parts[3])
    | _ -> failwith "Unknown shuffle"

let applyTechnique (cards: int array) =
    function
    | Cut n ->
        let cutIndex = if n < 0 then cards.Length + n else n

        Array.append cards[cutIndex..] cards[.. cutIndex - 1]
    | Deal n ->
        cards
        |> Array.mapi (fun i v -> (i * n) % cards.Length, v)
        |> Array.sortBy fst
        |> Array.map snd
    | Reverse -> cards |> Array.rev

let solve (input: string array) =
    let techniques = input |> Array.map parseTechnique
    let cards = [| 0 .. 10_007 - 1 |]

    let result1 =
        techniques |> Array.fold applyTechnique cards |> Array.findIndex ((=) 2019)

    let result2 = 0

    result1, result2, 6978, 0

DayUtils.runDay solve
