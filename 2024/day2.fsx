#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Input.fs"

let isSafe level =
    let changes = level |> List.pairwise |> List.map (fun (a, b) -> b - a)

    changes |> List.forall (fun c -> c >= 1 && c <= 3)
    || changes |> List.forall (fun c -> c <= -1 && c >= -3)

let dampenedOptions level =
    { 0 .. List.length level - 1 }
    |> Seq.map (fun i -> level[.. i - 1] @ level[i + 1 ..])

let isSafeDampened level =
    isSafe level || level |> dampenedOptions |> Seq.exists isSafe

let solve (input: string array) =
    let levels = input |> Array.map Input.parseAllInts

    let result1 = levels |> Array.filter isSafe |> Array.length
    let result2 = levels |> Array.filter isSafeDampened |> Array.length

    result1, result2, 402, 455

DayUtils.runDay solve
