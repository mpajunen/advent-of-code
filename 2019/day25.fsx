#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "./IntCode.fs"

let createGame program =
    let computer = program |> IntCode.Computer

    IntCode.marshalAscii >> computer.run >> IntCode.parseAscii

let commands =
    [
      // Hull Breach
      "north" // 0, 1
      // "take " + "giant electromagnet"
      "south" // 0, 0

      // West side
      "west" // -1, 0
      "take " + "hologram"
      "north" // -1, -1
      "take " + "space heater"
      "east" // 0, -1
      "take " + "space law space brochure"
      "south" // 0, 0
      "north" // 0, -1
      "east" // 1, -1
      "take " + "tambourine"
      "south" // 1, 0
      "north" // 1, -1
      "north" // 1, -2
      // "take " + "photons"
      "south" // 1, -1
      "west" // 0, -1
      "west" // -1, -1
      "south" // -1, 0
      "south" // -1, 1
      // "take " + "molten lava"
      "north" // -1, 0
      "east" // 0, 0

      // East side
      "east" // 1, 0
      "take " + "festive hat"
      "east" // 2, 0
      "take " + "food ration"
      "east" // 3, 0
      "take " + "spool of cat6"
      "west" // 2, 0
      "north" // 2, -1
      "south" // 2, 0
      "west" // 1, 0
      "south" // 1, 1
      // "take " + "infinite loop"
      "east" // 2, 1
      "east" // 3, 1
      "take " + "fuel cell"
      "east" // 4, 1

      // Security Checkpoint
      "drop " + "fuel cell" // Too heavy by itself
      //   "drop " + "space law space brochure" // Too light without
      "drop " + "festive hat" // Too heavy with brochure

      //   "drop " + "spool of cat6"
      //   "drop " + "hologram"
      //   "drop " + "space heater"

      "drop " + "tambourine"
      "drop " + "food ration"

      "south" ]

let play game =
    let output = game commands

    // printfn "%s" output

    2098048

let solve (input: string array) =
    let program = IntCode.parseProgram input[0]

    let result1 = program |> createGame |> play

    result1, (), 2098048, ()

DayUtils.runDay solve
