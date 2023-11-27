#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "./IntCode.fs"

let allPairs (aAll: 'A seq) (bAll: 'B seq) : ('A * 'B) seq =
    Seq.collect (fun a -> Seq.map (fun b -> (a, b)) bAll) aAll

let runProgram (program: int array) =
    let computer = IntCode.Computer program
    computer.run [||] |> ignore

    computer.state[0]

let modifyProgram ((noun, verb): int * int) (program: int array) =
    let copy = Array.copy program
    copy[1] <- noun
    copy[2] <- verb

    copy

let runModified (program: int array) (input: int * int) =
    program |> modifyProgram input |> runProgram

let findInput (program: int array) =
    let inputRange = { 0..99 }

    allPairs inputRange inputRange
    |> Seq.find (fun pair -> runModified program pair = 19690720)

let solve (input: string array) =
    let program = input[0].Split "," |> Array.map int

    let result1 = runModified program (12, 2)
    let result2 = findInput program |> (fun (a, b) -> 100 * a + b)

    result1, result2, 4138687, 6635

DayUtils.runDay solve
