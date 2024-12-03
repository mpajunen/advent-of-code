#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Input.fs"
#load "./Assembunny.fs"

open Assembunny

let loopBlock1 s =
    let mutable a, b, c, d =
        s.Registers["a"], s.Registers["b"], s.Registers["c"], s.Registers["d"]

    // cpy 362 b, inc d, dec b, jnz b -2, dec c, jnz c -5
    d <- d + 362 * c
    b <- 0
    c <- 0

    { s with
        Registers = [ "a", a; "b", b; "c", c; "d", d ] |> Map
        Ip = s.Ip + 6 }

let loopBlock2 s =
    let mutable a, b, c, d =
        s.Registers["a"], s.Registers["b"], s.Registers["c"], s.Registers["d"]

    // cpy 2 c, jnz b 2, jnz 1 6, dec b, dec c, jnz c -4, inc a, jnz 1 -7, cpy 2 b
    a <- a + b / 2
    c <- if b % 2 = 0 then 2 else 1
    b <- 2

    { s with
        Registers = [ "a", a; "b", b; "c", c; "d", d ] |> Map
        Ip = s.Ip + 9 }

let replacements = Map [ 2, loopBlock1; 12, loopBlock2 ]

let init initialA =
    initialRegisters |> Map.add "a" initialA |> initialState replacements

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
