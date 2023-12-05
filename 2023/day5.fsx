#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"

let rec split splitter (input: 'a array) =
    match Array.tryFindIndex splitter input with
    | Some n -> input[.. n - 1] :: split splitter input[n + 1 ..]
    | None -> [ input ]

type Range = { Start: int64; End: int64 }
type Formula = { Range: Range; Shift: int64 }

let rangeOption (s, e) =
    if s < e then Some { Start = s; End = e } else None

let compareRanges (a: Range) (b: Range) =
    let before = min a.Start b.Start, min a.End b.Start // a before b
    let intersection = max a.Start b.Start, min a.End b.End
    let after = max a.Start b.End, max a.End b.End // a after b

    [ intersection ] |> List.choose rangeOption, [ before; after ] |> List.choose rangeOption

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

    let seeds =
        sections[0].[0].Split(": ").[1].Split " " |> Array.map int64 |> Array.toList

    let maps = sections[1..] |> List.map parseMap

    seeds, maps

let moveRange (formula: Formula) (range: Range) =
    { Start = range.Start + formula.Shift
      End = range.End + formula.Shift }

let applyFormula (formula: Formula) (range: Range) =
    let inside, outside = compareRanges range formula.Range

    inside |> List.map (moveRange formula), outside

let rec applyMap (ranges: Range list) =
    function
    | [] -> ranges
    | formula :: formulas ->
        let applied = ranges |> List.map (applyFormula formula)

        let changed = applied |> List.collect fst
        let unchanged = applied |> List.collect snd

        List.append changed <| applyMap unchanged formulas

let applyMaps (maps: Formula list list) (ranges: Range list) = maps |> List.fold applyMap ranges

let solve (input: string array) =
    let seeds, maps = parseInput input

    let findLocationMin = applyMaps maps >> List.map _.Start >> List.min

    let result1 =
        seeds |> List.map (fun s -> { Start = s; End = s + 1L }) |> findLocationMin

    let result2 =
        seeds
        |> List.chunkBySize 2
        |> List.map (fun c -> { Start = c[0]; End = c[0] + c[1] })
        |> findLocationMin

    result1, result2, 346433842L, 60294664L

DayUtils.runDay solve
