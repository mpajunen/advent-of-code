#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"

let rec split splitter (input: 'a array) =
    match Array.tryFindIndex splitter input with
    | Some n -> input[.. n - 1] :: split splitter input[n + 1 ..]
    | None -> [ input ]

type Range = { Start: int64; End: int64 }
type Formula = { Range: Range; Shift: int64 }

let parseFormula (row: string) =
    row.Split " "
    |> Array.map int64
    |> fun c ->
        { Range = { Start = c[1]; End = c[1] + c[2] }
          Shift = c[0] - c[1] }

let parseMap (rows: string array) =
    rows[1..]
    |> Array.map parseFormula
    |> Array.sortBy _.Range.Start
    |> Array.toList

let parseInput (input: string array) =
    let sections = input |> split (fun s -> s.Length = 0)

    let seeds = sections[0].[0].Split(": ").[1].Split " " |> Array.map int64
    let maps = sections[1..] |> List.map parseMap

    seeds, maps

let moveRange (formula: Formula) (range: Range) =
    { Start = range.Start + formula.Shift
      End = range.End + formula.Shift }

let applyFormula (range: Range) (formula: Formula) =
    let before =
        if range.Start < formula.Range.Start then
            Some
                { Start = range.Start
                  End = min range.End formula.Range.Start }
        else
            None

    let commonStart = max range.Start formula.Range.Start
    let commonEnd = min range.End formula.Range.End

    let common =
        if commonEnd > commonStart then
            Some { Start = commonStart; End = commonEnd }
        else
            None
        |> Option.map (moveRange formula)

    let after =
        if commonEnd < range.End then
            Some
                { Start = max commonEnd range.Start
                  End = range.End }
        else
            None

    Array.choose id [| before; common |], after

let rec applyFormulas (range: Range) =
    function
    | [] -> [| range |]
    | formula :: formulas ->
        let applied, remaining = applyFormula range formula

        match remaining with
        | None -> applied
        | Some r -> Array.append applied <| applyFormulas r formulas

let applyMap (ranges: Range array) (map: Formula list) =
    ranges |> Array.collect (fun r -> applyFormulas r map)

let applyMaps (maps: Formula list list) (ranges: Range array) = maps |> List.fold applyMap ranges

let solve (input: string array) =
    let seeds, maps = parseInput input

    let findLocationMin = applyMaps maps >> Array.map _.Start >> Array.min

    let result1 =
        seeds |> Array.map (fun s -> { Start = s; End = s + 1L }) |> findLocationMin

    let result2 =
        seeds
        |> Array.chunkBySize 2
        |> Array.map (fun c -> { Start = c[0]; End = c[0] + c[1] })
        |> findLocationMin

    result1, result2, 346433842L, 60294664L

DayUtils.runDay solve
