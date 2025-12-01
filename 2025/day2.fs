module Year2025.Day2

let parseRanges (row: string) =
    row.Split ',' |> Array.map (fun s -> s.Split '-' |> Array.map int64)

let isInvalid1 n =
    let s = string n

    s[.. s.Length / 2 - 1] = s[s.Length / 2 ..]

let isInvalid2 n =
    let s = string n

    let isInvalidCut n =
        s |> Seq.chunkBySize n |> Seq.distinct |> Seq.length = 1

    [ 1 .. s.Length / 2 ] |> List.exists isInvalidCut

let sumInvalid isInvalid (range: int64[]) =
    seq { range[0] .. range[1] } |> Seq.filter isInvalid |> Seq.sum

let solve =
    DayUtils.solveDay (fun input ->
        let ranges = input[0] |> parseRanges

        let result1 = ranges |> Array.sumBy (sumInvalid isInvalid1)
        let result2 = ranges |> Array.sumBy (sumInvalid isInvalid2)

        result1, result2, 023534117921L, 31755323497L)
