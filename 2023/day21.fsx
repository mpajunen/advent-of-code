#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Vec2.fs"

open Vec2

let LARGE_COST = 1_000_000

let getCosts grid start =
    let mutable front = Set.singleton start
    let costs = Array2D.map (fun _ -> LARGE_COST) grid
    Grid.set costs start 0

    let isAvailableStep p =
        Grid.isWithin grid p && Grid.get grid p <> '#' && Grid.get costs p = LARGE_COST

    let mutable step = 1

    while not front.IsEmpty do
        front <-
            front
            |> Set.toList
            |> List.collect Move.adjacent
            |> Set
            |> Set.filter isAvailableStep

        for p in front do
            Grid.set costs p step

        step <- step + 1

    costs

let getSlotCount costs maxCost =
    Grid.countOf (fun n -> n <= maxCost && n % 2 = maxCost % 2) costs

"""
       /\
     / AA \

    /A BB A\
  / AA BB AA \

 /A BB AA BB A\
 \A BB AA BB A/

  \ AA BB AA /
    \A BB A/

     \ AA /
       \/

From outside:
- B * 8, only corners => B_full * 2 - B_center * 2
- A * 4, each missing two corners => A_full * 2 + A_center * 2
- A * 4, each corner missing once => A_full * 3 + A_center * 1
- B_full * 4
- A_full
"""

// Assumes square grid and corridors from center to sides, so every corner or
// side can be reached with the same amount of steps. Latter is not true for
// the example input.
let getEntryPoints grid =
    let high = Array2D.length1 grid - 1
    let middle = high / 2

    let cornerEntries =
        [ (0, 0); (high, 0); (0, high); (high, high) ]
        |> List.map (fun (y, x) -> Vec.create y x, high + 2)

    let sideEntries =
        [ (0, middle); (middle, high); (high, middle); (middle, 0) ]
        |> List.map (fun (y, x) -> Vec.create y x, middle + 1)

    cornerEntries, sideEntries

// Assumes step count where there's only one incomplete
let getEntrySlots grid stepCount =
    let cornerEntries, sideEntries = getEntryPoints grid

    let sideLength = Array2D.length1 grid

    let cornerCosts = cornerEntries |> List.map (fun (p, cost) -> getCosts grid p, cost)
    let sideCosts = sideEntries |> List.map (fun (p, cost) -> getCosts grid p, cost)

    let getSlots extra (costGrid, cost) =
        let baseVal = (stepCount - cost) % sideLength

        getSlotCount costGrid (baseVal + extra * sideLength) |> int64

    {| OuterCorners = cornerCosts |> List.map (getSlots 0)
       InnerCorners = cornerCosts |> List.map (getSlots 1)
       Sides = sideCosts |> List.map (getSlots 0)
       InsideA = sideCosts[0] |> getSlots 1
       InsideB = sideCosts[0] |> getSlots 2 |}

// Each quadrant
//
// /\
// AA\
// BBA\
// BBAA\
// AABBA\
// AABBAA\
// BBAABBA\
// BBAABBAA\
//
let quadrantCounts sideLength stepCount =
    let side = stepCount / sideLength |> int64

    {| OuterCorners = side // Only one corner
       InnerCorners = side - 1L // One corner missing
       InsideA = side / 2L |> fun s -> s * s // Full. 1, 3, 5, 7, ..., 2 n_a - 1 -> n_a * n_a
       InsideB = (side - 1L) / 2L |> fun s -> s * (s + 1L) // Full. 2, 4, 6, 8, ..., 2 n_b -> n_b * (n_b + 1)
    |}

let findReachable grid costs stepCount =
    let gridSlots = getEntrySlots grid stepCount
    let gridCounts = quadrantCounts (Array2D.length1 costs) stepCount

    let outerCorners = gridCounts.OuterCorners * (gridSlots.OuterCorners |> List.sum)
    let innerCorners = gridCounts.InnerCorners * (gridSlots.InnerCorners |> List.sum)

    let innerA = 4L * gridCounts.InsideA * gridSlots.InsideA
    let innerB = 4L * gridCounts.InsideB * gridSlots.InsideB

    let sides = gridSlots.Sides |> List.sum

    let center = getSlotCount costs stepCount |> int64

    outerCorners + innerCorners + innerA + innerB + sides + center

let solve (input: string array) =
    let grid = input |> Grid.fromRows
    let start = grid |> Grid.findKey ((=) 'S')

    let costs = getCosts grid start

    let result1 = getSlotCount costs 64
    let result2 = findReachable grid costs 26501365

    result1, result2, 3572, 594606492802848L

DayUtils.runDay solve
