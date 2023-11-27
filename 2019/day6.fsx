#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"

let getOrbit (row: string) =
    row.Split ")" |> fun parts -> (parts[1], parts[0])

let solve (input: string array) =
    let orbits = input |> Array.map getOrbit
    let orbitMap = Map orbits

    let rec getParents object =
        let parent = Map.tryFind object orbitMap
        match parent with
        | Some p -> Set.add p (getParents p)
        | None -> Set.empty

    let you = getParents "YOU"
    let santa = getParents "SAN"

    let result1 = orbits |> Array.sumBy (fst >> getParents >> Set.count)
    let result2 = (you - santa) + (santa - you) |> Set.count

    result1, result2, 314247, 514

DayUtils.runDay solve
