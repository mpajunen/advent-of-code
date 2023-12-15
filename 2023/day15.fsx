#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"

let hash (s: string) =
    s.ToCharArray() |> Array.fold (fun acc c -> (int c + acc) * 17 % 256) 0

type Op =
    | Add of int
    | Remove

type State = (string * int) array array

let parseInstruction (s: string) =
    if Seq.last s = '-' then
        s[.. s.Length - 2], Remove
    else
        s[.. s.Length - 3], Add(Seq.last s |> string |> int)

let applyInstruction (boxes: State) (label, op) =
    let n = hash label

    match op with
    | Add num ->
        let index = boxes[n] |> Array.tryFindIndex (fst >> (=) label)

        match index with
        | Some i -> boxes[n][i] <- (label, num)
        | None -> boxes[n] <- Array.append boxes[n] [| (label, num) |]

    | Remove -> boxes[n] <- Array.filter (fst >> (<>) label) boxes[n]

let buildBoxes steps =
    let boxes = Array.create 256 [||]

    steps |> Array.iter (parseInstruction >> applyInstruction boxes)

    boxes

let lensScore index (_, focalLength) = (index + 1) * focalLength

let boxScore index box =
    (box |> Array.mapi lensScore |> Array.sum) * (index + 1)

let solve (input: string array) =
    let steps = input[0].Split ","

    let result1 = steps |> Array.sumBy hash
    let result2 = steps |> buildBoxes |> Array.mapi boxScore |> Array.sum

    result1, result2, 519603, 244342

DayUtils.runDay solve
