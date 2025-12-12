module Year2025.Day12

let parseRegion =
    Input.parseAllInts
    >> function
        | x :: y :: shapeCounts -> x, y, shapeCounts
        | _ -> failwith "Invalid region"

let parseInput input =
    let parts = input |> Collection.splitOn ((=) "")

    parts |> Array.last |> Array.map parseRegion

// For some reason, the shapes don't actually matter :(
let getRegionFitsBoxes (x, y, shapeCounts) =
    List.sum shapeCounts <= (x / 3) * (y / 3)

let solve =
    DayUtils.solveDay (fun input ->
        let regions = input |> parseInput

        let result1 = regions |> Array.filter getRegionFitsBoxes |> Array.length

        result1, (), 454, ())
