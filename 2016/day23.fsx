#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Input.fs"
#load "./Assembunny.fs"

open Assembunny

let loopBlock s =
    let mutable a, b, c, d =
        s.Registers["a"], s.Registers["b"], s.Registers["c"], s.Registers["d"]

    while d <> 0 do // jnz d -5
        c <- b // cpy b c

        while c <> 0 do // jnz c -2
            a <- a + 1 // inc a
            c <- c - 1 // dec c

        d <- d - 1 // dec d

    b <- b - 1 // dec b
    c <- b // cpy b c
    d <- c // cpy c d

    while d <> 0 do // jnz d -2
        d <- d - 1 // dec d
        c <- c + 1 // inc c

    { s with
        Registers = [ "a", a; "b", b; "c", c; "d", d ] |> Map
        Ip = s.Ip + 12 }

let replacements = Map [ 4, loopBlock ]

let init initialA =
    initialRegisters |> Map.add "a" initialA |> initialState replacements

let solve (input: string array) =
    let instructions = input |> Array.map parseInstruction

    let result1 = instructions |> init 7 |> exec |> (fun registers -> registers["a"])
    let result2 = 0

    result1, result2, 10223, 0

DayUtils.runDay solve
