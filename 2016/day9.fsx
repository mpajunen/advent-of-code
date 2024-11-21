#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Input.fs"

let rec getSize recur : string -> int64 =
    function
    | Input.ParseRegex "^(\w*)\((\d+)x(\d+)\)(.+)$" [ before; length; repeats; after ] ->
        let section, remaining = after[.. int length - 1], after[int length ..]

        let sectionLength = if recur then getSize recur section else section.Length

        int64 before.Length + int64 repeats * sectionLength + getSize recur remaining
    | file -> String.length file

let solve (input: string array) =
    let result1 = input[0] |> getSize false
    let result2 = input[0] |> getSize true

    result1, result2, 107035L, 11451628995L

DayUtils.runDay solve
