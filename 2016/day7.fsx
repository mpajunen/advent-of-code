#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"

let startReversedPair (s: char list) =
    if s.Length >= 4 && s[0] = s[3] && s[1] = s[2] && s[0] <> s[1] then
        Some s[0..3]
    else
        None

let startSurrounded (s: char list) =
    if s.Length >= 3 && s[0] = s[2] && s[0] <> s[1] then
        Some s[0..2]
    else
        None

let findSequences matcher address =
    let rec find inBrackets =
        function
        | [] -> []
        | '[' :: xs -> find true xs
        | ']' :: xs -> find false xs
        | x :: xs ->
            match matcher (x :: xs) with
            | None -> find inBrackets xs
            | Some sequence -> (sequence, inBrackets) :: find inBrackets xs

    let inside, outside = find false address |> List.partition snd

    inside |> List.map fst, outside |> List.map fst

let supportsTls address =
    let inside, outside = address |> findSequences startReversedPair

    List.length outside > 0 && List.length inside = 0

let isSslPair (a: char list) (b: char list) = a[0] = b[1] && a[1] = b[0]

let supportsSsl address =
    let inside, outside = address |> findSequences startSurrounded

    inside |> List.exists (fun i -> outside |> List.exists (isSslPair i))

let solve (input: string array) =
    let addresses = input |> Array.map (_.ToCharArray() >> Array.toList)

    let result1 = addresses |> Array.filter supportsTls |> Array.length
    let result2 = addresses |> Array.filter supportsSsl |> Array.length

    result1, result2, 115, 231

DayUtils.runDay solve
