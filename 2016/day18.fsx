#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"

let rec nextTiles row =
    match row with
    | left :: _ :: right :: _ -> (left = right) :: nextTiles (List.tail row)
    | _ -> []

let nextRow row = [ true ] @ row @ [ true ] |> nextTiles

let safeCount = Seq.filter id >> Seq.length

let countSafe rowCount initial =
    { 1..rowCount }
    |> Seq.fold (fun (row, count) _ -> nextRow row, count + safeCount row) (initial, 0)
    |> snd

let solve (input: string array) =
    let initialSafe = input[0].ToCharArray() |> Array.toList |> List.map ((=) '.') // Safe = true, trap = false

    let result1 = initialSafe |> countSafe 40
    let result2 = initialSafe |> countSafe 400_000

    result1, result2, 2035, 20000577

DayUtils.runDay solve
