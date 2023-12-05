#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"

let rec split splitter (input: 'a array) =
    match Array.tryFindIndex splitter input with
    | Some n -> input[.. n - 1] :: split splitter input[n + 1 ..]
    | None -> [ input ]

type Formula =
    { Destination: int64
      Length: int64
      Source: int64 }

type SeedRange = { Start: int64; Length: int64 }

let parseMap (rows: string array) =
    rows[1..]
    |> Array.map (fun row ->
        row.Split " "
        |> Array.map int64
        |> fun c ->
            { Destination = c[0]
              Source = c[1]
              Length = c[2] })
    |> Array.sortBy _.Source
    |> Array.toList

let parseInput (input: string array) =
    let sections = input |> split (fun s -> s.Length = 0)

    let seeds = sections[0].[0].Split(": ").[1].Split " " |> Array.map int64
    let maps = sections[1..] |> List.map parseMap

    seeds, maps

let moveRange (formula: Formula) (seed: SeedRange) =
    { Start = seed.Start + (formula.Destination - formula.Source)
      Length = seed.Length }

let applyFormula (seed: SeedRange) (formula: Formula) =
    let before =
        if seed.Start < formula.Source then
            Some
                { Start = seed.Start
                  Length = min seed.Length (formula.Source - seed.Start) }
        else
            None

    let seedEnd = seed.Start + seed.Length

    let commonStart = max seed.Start formula.Source
    let commonEnd = min seedEnd (formula.Source + formula.Length)

    let common =
        if commonEnd > commonStart then
            Some
                { Start = commonStart
                  Length = commonEnd - commonStart }
        else
            None
        |> Option.map (moveRange formula)

    let after =
        if commonEnd < seedEnd then
            Some
                { Start = max commonEnd seed.Start
                  Length = min seed.Length (seedEnd - commonEnd) }
        else
            None

    Array.choose id [| before; common |], after

let rec applyFormulas (range: SeedRange) =
    function
    | [] -> [| range |]
    | formula :: formulas ->
        let applied, remaining = applyFormula range formula

        match remaining with
        | None -> applied
        | Some r -> Array.append applied <| applyFormulas r formulas

let applyMap (ranges: SeedRange array) (map: Formula list) =
    ranges |> Array.collect (fun r -> applyFormulas r map)

let applyMaps (maps: Formula list list) (ranges: SeedRange array) = maps |> List.fold applyMap ranges

let solve (input: string array) =
    let seeds, maps = parseInput input

    let findLocationMin = applyMaps maps >> Array.map _.Start >> Array.min

    let result1 =
        seeds |> Array.map (fun s -> { Start = s; Length = 1 }) |> findLocationMin

    let result2 =
        seeds
        |> Array.chunkBySize 2
        |> Array.map (fun c -> { Start = c[0]; Length = c[1] })
        |> findLocationMin

    result1, result2, 346433842L, 60294664L

DayUtils.runDay solve
