#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Input.fs"

// Manually parsed
let executeParsed initialC =
    let mutable a, b, c, d = 0, 0, initialC, 0

    a <- 1 // cpy 1 a
    b <- 1 // cpy 1 b
    d <- 26 // cpy 26 d

    if c <> 0 then // jnz c 2, jnz 1 5
        c <- 7 // cpy 7 c

        d <- d + c

    while d <> 0 do // jnz d -6
        c <- a // cpy a c

        a <- a + b

        b <- c // cpy c b
        d <- d - 1 // dec d

    c <- 13 // cpy 13 c

    while c <> 0 do // jnz c -5
        d <- 14 // cpy 14 d

        a <- a + d

        c <- c - 1 // dec c

    a

let solve (input: string array) =
    let result1 = executeParsed 0
    let result2 = executeParsed 1

    result1, result2, 317993, 9227647

DayUtils.runDay solve
