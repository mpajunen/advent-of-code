#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Vec2.fs"

open Vec2

let size = 70 + 1
let target = { X = size - 1; Y = size - 1 }

let getMaze bytes =
    Array2D.init size size (fun y x -> if Set.contains { X = x; Y = y } bytes then '#' else '.')

let getPathLength bytes =
    let getAdjacent =
        bytes |> Set |> getMaze |> Grid.adjacentAvailablePositions ((=) '.')

    let distances = Array2D.init size size (fun _ _ -> 999_999)

    let rec findPath =
        function
        | [] -> Grid.get distances target
        | (position, steps) :: rest when Grid.get distances position > steps ->
            Grid.set distances position steps

            let next = getAdjacent position |> List.map (fun p -> p, steps + 1)

            rest @ next |> findPath
        | _ :: rest -> rest |> findPath

    findPath [ origin, 0 ]

let getFirstBlocker (bytes: Vec array) =
    let rec findByte low high =
        let mid = (low + high) / 2

        if low = high then
            bytes[low]
        else if bytes[..mid] |> getPathLength = 999_999 then
            findByte low mid
        else
            findByte (mid + 1) high

    findByte 1024 (bytes.Length - 1)

DayUtils.runDay (fun input ->
    let bytes = input |> Array.map Vec.fromString

    let result1 = bytes[..1024] |> getPathLength
    let result2 = bytes |> getFirstBlocker |> _.toString

    result1, result2, 384, "36,10")
