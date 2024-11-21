#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Vec2.fs"

let sortByFrequency = Seq.countBy id >> Seq.sortBy snd >> Seq.map (fst >> string)

let sortColsByFrequency = array2D >> Vec2.Grid.cols >> Seq.map sortByFrequency

let solve (input: string array) =
    let messages = input |> Array.map _.ToCharArray()

    let frequent = messages |> sortColsByFrequency

    let result1 = frequent |> Seq.map Seq.last |> String.concat ""
    let result2 = frequent |> Seq.map Seq.head |> String.concat ""

    result1, result2, "gyvwpxaz", "jucfoary"

DayUtils.runDay solve
