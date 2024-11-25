#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Input.fs"

// Manually parsed
let executeParsed initialC =
    let mutable a, b, c, d = 1, 1, initialC, 26

    if c <> 0 then // jnz c 2, jnz 1 5
        d <- d + 7

    for _ in 1..d do
        c <- a // cpy a c
        a <- a + b
        b <- c // cpy c b

    a + 13 * 14

let solve (input: string array) =
    let result1 = executeParsed 0
    let result2 = executeParsed 1

    result1, result2, 317993, 9227647

DayUtils.runDay solve
