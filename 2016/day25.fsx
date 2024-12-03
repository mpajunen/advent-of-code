#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Input.fs"
#load "./Assembunny.fs"

open Assembunny

let init initialA =
    initialRegisters |> Map.add "a" initialA |> initialState Map.empty

let validClock = { 0..9 } |> Seq.map (fun n -> n % 2)

let isValid n =
    init n >> execToOutput >> Seq.forall2 (=) validClock

let rec findLowestClock n instructions =
    if isValid n instructions then
        n
    else
        findLowestClock (n + 1) instructions

let solve (input: string array) =
    let result1 = input |> Array.map parseInstruction |> findLowestClock 0

    result1, (), 196, ()

DayUtils.runDay solve
