#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"

let rec nextTiles row =
    match row with
    | left :: _ :: right :: _ -> (left = right) :: nextTiles (List.tail row)
    | _ -> []

let nextRow row = [ true ] @ row @ [ true ] |> nextTiles

let safeCount = Seq.filter id >> Seq.length

let rec countSafe rowsLeft row =
    if rowsLeft = 0 then
        0
    else
        (row |> safeCount) + countSafe (rowsLeft - 1) (row |> nextRow)

let solve (input: string array) =
    let initialSafe = input[0].ToCharArray() |> Array.toList |> List.map ((=) '.') // Safe = true, trap = false

    let result1 = initialSafe |> countSafe 40
    let result2 = 0

    result1, result2, 2035, 0

DayUtils.runDay solve
