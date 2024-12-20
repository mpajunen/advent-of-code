#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Vec2.fs"

open Vec2

let bits (n: int) =
    System.Convert.ToString(n, 2).ToCharArray()

let initialCost favoriteNumber y x =
    let n = x * x + 3 * x + 2 * x * y + y + y * y + favoriteNumber

    let ones = n |> bits |> Seq.sumBy (fun c -> if c = '1' then 1 else 0)

    if ones % 2 = 1 then -1 else 999_999

let getCosts favorite =
    let mutable costs = Array2D.init 50 50 (initialCost favorite)

    let mutable frontier = [ { X = 1; Y = 1 } ]
    costs[1, 1] <- 0

    while List.length frontier > 0 do
        let position = List.head frontier
        let cost = costs[position.Y, position.X] + 1

        let next =
            position
            |> Grid.adjacentPositions costs
            |> List.filter (fun p -> costs[p.Y, p.X] > cost)

        next |> List.iter (fun p -> costs[p.Y, p.X] <- cost)

        frontier <- List.append (List.tail frontier) next

    costs

let solve (input: string array) =
    let costs = int input[0] |> getCosts

    let result1 = costs[39, 31]
    let result2 = costs |> Grid.countOf (fun c -> c >= 0 && c <= 50)

    result1, result2, 96, 141

DayUtils.runDay solve
