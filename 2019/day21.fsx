#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "./IntCode.fs"

let instructions1 =
    [ "NOT C T"
      "AND C T" // T = false
      "NOT T T" // T = true
      "AND A T"
      "AND B T"
      "AND C T"
      "NOT T J"
      "AND D J"
      "WALK" ]

let instructions2 =
    [ "NOT E J"
      "OR H J"
      "NOT B T"
      "AND T J" // J = !b and (!e or h)
      "NOT H T"
      "AND F T"
      "OR C T"
      "NOT T T"
      "OR T J" // J = J or (!c and (!f or h))
      "NOT A T"
      "OR T J" // J = J or !a
      "AND D J" // J = J and d
      "RUN" ]

let solvePart program =
    IntCode.marshalAscii >> IntCode.run program >> Array.last

let solve (input: string array) =
    let program = IntCode.parseProgram input[0]

    let result1 = instructions1 |> solvePart program
    let result2 = instructions2 |> solvePart program

    result1, result2, 19360724L, 1140450681L

DayUtils.runDay solve
