module Year2025.Day12

let parseRegion =
    Input.parseAllInts
    >> function
        | x :: y :: shapeCounts -> x, y, shapeCounts
        | _ -> failwith "Invalid region"

let parseInput input =
    let parts = input |> Collection.splitOn ((=) "")

    parts[0 .. parts.Length - 2] |> Array.map (fun s -> s[1..] |> array2D), parts |> Array.last |> Array.map parseRegion

let getBoxFit (x, y, counts) = counts |> List.sum <= (x / 3) * (y / 3)

let getTightlyPackedFit (shapeSizes: int[]) (x, y, counts) =
    counts |> List.mapi (fun i count -> count * shapeSizes[i]) |> List.sum <= x * y

let solve =
    DayUtils.solveDay (fun input ->
        let shapes, regions = input |> parseInput

        let sizes = shapes |> Array.map (Vec2.Grid.countOf ((=) '#'))

        let minimumFit = regions |> Array.filter getBoxFit |> Array.length
        let maximumFit = regions |> Array.filter (getTightlyPackedFit sizes) |> Array.length

        if minimumFit <> maximumFit then
            failwithf "Min and max fits don't match: %d vs %d. Conclusive answer not available." minimumFit maximumFit

        let result1 = minimumFit

        result1, (), 454, ())
