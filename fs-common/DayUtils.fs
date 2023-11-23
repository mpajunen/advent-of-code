module DayUtils

open System

let readInput year day =
    System.IO.Path.Combine(__SOURCE_DIRECTORY__, "..", sprintf "%d/input/day%d.txt" year day)
    |> System.IO.File.ReadAllLines

let extractParams () =
    let args = Environment.GetCommandLineArgs()

    let parts = args[1].Split "/"
    let fileName = Array.last parts
    let dir = parts.[Array.length parts - 2]

    let year = dir[0..3] |> int

    let day = (fileName.Split(".").[0])[3..] |> int

    year, day

type SolveDay = array<string> -> int * int

let runDay (solve: SolveDay) =
    let year, day = extractParams()

    let result1, result2 = readInput year day |> solve

    printfn "%d, %d" result1 result2
