#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Input.fs"

type Disc =
    { Number: int
      Count: int
      Position: int }

let parseDisc =
    function
    | Input.ParseRegex "Disc #(\d+) has (\d+) positions; at time=0, it is at position (\d+)." [ number; count; position ] ->
        { Number = int number
          Count = int count
          Position = int position }
    | s -> failwith $"Invalid input ${s}."

let getDiscPosition time disc =
    (disc.Position + time + disc.Number) % disc.Count

let isSlot time =
    List.forall (getDiscPosition time >> (=) 0)

let rec findSlot time discs =
    if isSlot time discs then
        time
    else
        findSlot (time + 1) discs

let solve (input: string array) =
    let discs = input |> Array.map parseDisc |> Array.toList

    let extraDisc =
        { Number = discs.Length + 1
          Count = 11
          Position = 0 }

    let result1 = discs |> findSlot 0
    let result2 = discs @ [ extraDisc ] |> findSlot 0

    result1, result2, 317371, 2080951

DayUtils.runDay solve
