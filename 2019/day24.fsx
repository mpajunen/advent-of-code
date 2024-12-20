#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Vec2.fs"

open Vec2

let gridNeighbors grid position =
    Move.adjacent position
    |> List.filter (Grid.isWithin grid)
    |> List.map (Grid.get grid)

let bugCount tiles =
    tiles |> Seq.sumBy (fun tile -> if tile = '#' then 1 else 0)

let nextTile current neighbors =
    match current, bugCount neighbors with
    | '.', 1 -> '#'
    | '.', 2 -> '#'
    | '#', 1 -> '#'
    | _ -> '.'

let evolve grid =
    let evolveTile position tile =
        position |> gridNeighbors grid |> nextTile tile

    grid |> Grid.mapi evolveTile

let rec evolveUntilRepeat evolutions =
    let next = List.head evolutions |> evolve

    if List.contains next evolutions then
        next
    else
        evolveUntilRepeat (next :: evolutions)

let bioDiversityRating =
    Grid.values
    >> Seq.mapi (fun i tile -> if tile = '#' then pown 2 i else 0)
    >> Seq.sum

let emptyLevel = Array2D.create 5 5 '.'
let center = { X = 2; Y = 2 }

let edges: (((Vec -> bool) * Vec * (Grid<char> -> char array)) list) =
    [ (fun p -> p.X = 0), { X = 1; Y = 2 }, (fun g -> g[*, 0])
      (fun p -> p.X = 4), { X = 3; Y = 2 }, (fun g -> g[*, 4])
      (fun p -> p.Y = 0), { X = 2; Y = 1 }, (fun g -> g[0, *])
      (fun p -> p.Y = 4), { X = 2; Y = 3 }, (fun g -> g[4, *]) ]

let outerNeighbors grid p =
    edges
    |> List.choose (fun (check, abovePosition, _) -> if check p then Some(Grid.get grid abovePosition) else None)

let innerNeighbors grid p =
    edges
    |> List.collect (fun (_, position, slice) -> if p = position then slice grid |> Array.toList else [])

let evolveLevel (above, current, below) =
    let neighbors p =
        gridNeighbors current p @ outerNeighbors above p @ innerNeighbors below p

    let evolveTile position tile =
        match position with
        | p when p = center -> '.'
        | p -> p |> neighbors |> nextTile tile

    Grid.mapi evolveTile current

let zipLevels levels =
    List.zip3
        ([ emptyLevel; emptyLevel ] @ levels)
        ([ emptyLevel ] @ levels @ [ emptyLevel ])
        (levels @ [ emptyLevel; emptyLevel ])

let rec trimLevels =
    function
    | level :: rest when level = emptyLevel -> trimLevels rest
    | levels when List.last levels = emptyLevel -> trimLevels (List.take (List.length levels - 1) levels)
    | levels -> levels

let evolveLevels = zipLevels >> List.map evolveLevel >> trimLevels

let rec evolveRecursive levels =
    function
    | 0 -> levels
    | minutesLeft -> evolveRecursive (evolveLevels levels) (minutesLeft - 1)

let MINUTES = 200

let solve (input: string array) =
    let initial = input |> Grid.fromRows

    let result1 = evolveUntilRepeat [ initial ] |> bioDiversityRating

    let result2 =
        evolveRecursive [ initial ] MINUTES |> List.sumBy (Grid.values >> bugCount)

    result1, result2, 28772955, 2023

DayUtils.runDay solve
