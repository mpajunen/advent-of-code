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

type SolveDay<'A1, 'A2> = array<string> -> 'A1 * 'A2 * 'A1 * 'A2

let runDay (solve: SolveDay<_, _>) =
    let year, day = extractParams()

    let result1, result2, expected1, expected2 = readInput year day |> solve

    printfn "%A" result1
    if result1 <> expected1 then
        printfn "Expected %A got %A!" expected1 result1

    printfn "%A" result2
    if result2 <> expected2 then
        printfn "Expected %A got %A!" expected2 result2
