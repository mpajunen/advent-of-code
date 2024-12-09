#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"

let getTotalBlocks =
    Array.indexed
    >> Array.filter (fun (index, _) -> index % 2 = 0)
    >> Array.sumBy snd

let filesFromEnd map =
    seq {
        for index in (Array.length map - 1) .. -2 .. 0 do
            for _ in 1 .. map[index] do
                yield index
    }

let compactChecksum blockSizes =
    let totalBlocks = blockSizes |> getTotalBlocks

    let mutable index = 0
    let mutable startIndex = 0
    let mutable endIndex = Array.length blockSizes - 1

    let mutable checksum = 0L

    let fromEnd = filesFromEnd(blockSizes).GetEnumerator()

    while startIndex <= endIndex do
        let mapValue = blockSizes[startIndex]

        for _ in 1 .. (min mapValue (totalBlocks - index)) do
            let fileId =
                if startIndex % 2 = 0 then
                    startIndex / 2
                else
                    fromEnd.MoveNext() |> ignore
                    endIndex <- fromEnd.Current

                    endIndex / 2

            checksum <- checksum + int64 (fileId * index)
            index <- index + 1

        startIndex <- startIndex + 1

    checksum

DayUtils.runDay (fun input ->
    let blockSizes = input[0].ToCharArray() |> Array.map (string >> int)

    let result1 = blockSizes |> compactChecksum
    let result2 = 0

    result1, result2, 6241633730082L, 0)
