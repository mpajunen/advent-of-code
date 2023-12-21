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

let findReachable grid costs stepCount =
    let maxY = Array2D.length1 costs - 1
    let maxX = Array2D.length2 costs - 1

    let edges = [ costs[0, *]; costs[maxY, *]; costs[*, 0]; costs[*, maxX] ]

    let cornerEntries =
        [ (maxY, maxX), Array.head edges[0] + 2
          (maxY, 0), Array.last edges[0] + 2
          (0, maxX), Array.head edges[1] + 2
          (0, 0), Array.last edges[1] + 2 ]
        |> List.map (fun ((y, x), cost) -> Vec.create y x, cost)

    let sideBase =
        edges
        |> List.map (fun edge ->
            let minValue = Array.min edge

            Array.findIndex ((=) minValue) edge, minValue)

    let sideEntries =
        [ (maxY, fst sideBase[0]), snd sideBase[0] + 1
          (0, fst sideBase[1]), snd sideBase[1] + 1
          (fst sideBase[2], maxX), snd sideBase[2] + 1
          (fst sideBase[3], 0), snd sideBase[3] + 1 ]
        |> List.map (fun ((y, x), cost) -> Vec.create y x, cost)

    let sideLength = Array2D.length1 costs

    let cornerCosts = cornerEntries |> List.map (fun (p, cost) -> getCosts grid p, cost)
    let sideCosts = sideEntries |> List.map (fun (p, cost) -> getCosts grid p, cost)

    let getCostOptions (costGrid, cost) =
        let baseVal = (stepCount - cost) % sideLength
        let options = [ 0..4 ] |> List.map (fun n -> baseVal + n * sideLength)

        options
        |> List.map (fun maxCost -> Grid.countOf (fun n -> n <= maxCost && n % 2 = maxCost % 2) costGrid)

    let cornerReachables = cornerCosts |> List.map getCostOptions
    let sideReachables = sideCosts |> List.map getCostOptions

    let quadrantOuterCornerCount = (stepCount - (sideLength - 1)) / sideLength + 1
    let quadrantInnerCornerCount = quadrantOuterCornerCount - 1

    let seriesSum s e =
        int64 ((e + s) / 2) * int64 ((e - s) / 2 + 1)

    let quadrantInnerCounts =
        [ seriesSum ((quadrantInnerCornerCount + 1) % 2 + 1) quadrantInnerCornerCount
          seriesSum (quadrantInnerCornerCount % 2 + 1) (quadrantInnerCornerCount - 1) ]

    let outerCorners =
        int64 quadrantOuterCornerCount
        * int64 (cornerReachables |> List.sumBy (fun r -> r[0]))

    let innerCorners =
        int64 quadrantInnerCornerCount
        * int64 (cornerReachables |> List.sumBy (fun r -> r[1]))

    let innerA = 4L * quadrantInnerCounts[0] * (int64 cornerReachables.[0].[2])
    let innerB = 4L * quadrantInnerCounts[1] * (int64 cornerReachables.[0].[3])

    let sides = sideReachables |> List.sumBy (fun r -> r[0]) |> int64

    let center = costs |> Grid.countOf (fun n -> n % 2 = stepCount % 2) |> int64

    outerCorners + innerCorners + innerA + innerB + sides + center

let solve (input: string array) =
    let grid = input |> Grid.fromRows
    let start = grid |> Grid.findKey ((=) 'S')

    let costs = getCosts grid start

    let result1 = costs |> Grid.countOf (fun n -> n <= 64 && n % 2 = 0)
    let result2 = findReachable grid costs 26501365

    result1, result2, 3572, 594606492802848L

DayUtils.runDay solve
