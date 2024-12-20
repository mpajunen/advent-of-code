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

    let distances = Array2D.create size size 999_999

    let rec findPath =
        function
        | [] -> Grid.get distances target
        | (position, steps) :: rest when Grid.get distances position > steps ->
            Grid.set distances position steps

            let next = getAdjacent position |> List.map (fun p -> p, steps + 1)

            rest @ next |> findPath
        | _ :: rest -> rest |> findPath

    findPath [ origin, 0 ]

let binarySearch predicate low high =
    let rec find low high =
        let mid = (low + high) / 2

        if low = high then low
        else if predicate mid then find low mid
        else find (mid + 1) high

    find low high

let getFirstBlockerIndex (bytes: Vec array) =
    binarySearch (fun i -> bytes[..i] |> getPathLength = 999_999) 1024 (bytes.Length - 1)

DayUtils.runDay (fun input ->
    let bytes = input |> Array.map Vec.fromString

    let result1 = bytes[..1024] |> getPathLength
    let result2 = bytes |> getFirstBlockerIndex |> (fun index -> bytes[index].toString)

    result1, result2, 384, "36,10")
