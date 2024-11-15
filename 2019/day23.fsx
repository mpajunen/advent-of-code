#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "./IntCode.fs"

let readPackets = Array.chunkBySize 3 >> Array.map (fun p -> p[0], p[1], p[2])

let createComputer program address =
    let computer = IntCode.Computer program
    computer.run [| address |] |> ignore

    computer

let createComputers program =
    Array.init 50 (int64 >> createComputer program)

let initialize (computers: IntCode.Computer array) =
    computers |> Array.collect (fun c -> c.run [| -1L |]) |> readPackets

let send (computers: IntCode.Computer array) (address, x, y) =
    computers[int address].run [| x; y |] |> readPackets

let runUntilFirst (computers: IntCode.Computer array) =
    let rec sendPackets packets =
        match Array.head packets with
        | 255L, _, y -> y
        | packet -> packet |> send computers |> Array.append packets[1..] |> sendPackets

    computers |> initialize |> sendPackets

let runUntilRepeat computers =
    let rec runUntilIdle packets =
        match Array.head packets with
        | 255L, x, y when packets.Length = 1 -> x, y
        | 255L, _, _ -> packets[1..] |> runUntilIdle
        | packet -> packet |> send computers |> Array.append packets[1..] |> runUntilIdle

    let rec sendPackets previous packets =
        let x, y = runUntilIdle packets

        if y = previous then y else sendPackets y [| 0L, x, y |]

    computers |> initialize |> sendPackets 0L

let solve (input: string array) =
    let program = IntCode.parseProgram input[0]

    let result1 = program |> createComputers |> runUntilFirst
    let result2 = program |> createComputers |> runUntilRepeat

    result1, result2, 17714L, 10982L

DayUtils.runDay solve
