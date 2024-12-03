#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Input.fs"
#load "./Assembunny.fs"

open Assembunny

let loopBlock s =
    let mutable a, b, c, d =
        s.Registers["a"], s.Registers["b"], s.Registers["c"], s.Registers["d"]

    a <- a + b * d
    b <- b - 1
    c <- b + b
    d <- 0

    { s with
        Registers = [ "a", a; "b", b; "c", c; "d", d ] |> Map
        Ip = s.Ip + 12 }

let replacements = Map [ 4, loopBlock ]

let init initialA =
    initialRegisters |> Map.add "a" initialA |> initialState replacements

let solve (input: string array) =
    let instructions = input |> Array.map parseInstruction

    let result1 = instructions |> init 7 |> exec |> (fun registers -> registers["a"])
    let result2 = instructions |> init 12 |> exec |> (fun registers -> registers["a"])

    result1, result2, 10223, 479006783

DayUtils.runDay solve
