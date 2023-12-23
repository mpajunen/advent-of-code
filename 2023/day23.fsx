#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Vec2.fs"

open Vec2

let getAdjacent (point: Vec) =
    [ { X = 0; Y = 1 }, 'v'
      { X = -1; Y = 0 }, '<'
      { X = 1; Y = 0 }, '>'
      { X = 0; Y = -1 }, '^' ]
    |> List.map (fun (dp, slope) -> add dp point, slope)

type Graph = Map<Vec, (Vec * int) list>

let buildGraph canClimb grid : Graph =
    let start = Vec.create 0 1
    let goal = Vec.create (Array2D.length1 grid - 1) (Array2D.length2 grid - 2)

    let hasOpenTile (p, _) =
        Grid.isWithin grid p && Grid.get grid p <> '#'

    let canMoveTo (p, slope) =
        hasOpenTile (p, slope)
        && (canClimb || Grid.get grid p |> (fun tile -> tile = slope || tile = '.'))

    let isFork =
        getAdjacent
        >> List.filter hasOpenTile
        >> fun neighbors -> List.length neighbors > 2

    let forks =
        grid
        |> Grid.entries
        |> Seq.filter hasOpenTile
        |> Seq.map fst
        |> Seq.filter isFork
        |> Set

    let nodes = Set.union ([ start; goal ] |> Set) forks

    let rec buildPaths (pathBefore: Set<Vec>) (position: Vec) =
        let path = Set.add position pathBefore

        let options =
            getAdjacent position
            |> List.filter canMoveTo
            |> List.map fst
            |> List.filter (fun p -> not <| Set.contains p path)

        let ending, continuing = options |> List.partition (fun p -> Set.contains p nodes)

        let ended = ending |> List.map (fun p -> p, path.Count)
        let continued = continuing |> List.collect (buildPaths path)

        ended @ continued

    let createNode position = position, buildPaths Set.empty position

    nodes |> Seq.map createNode |> Map

let getMaxPathLength start goal (graph: Graph) =
    let rec getMaxLength path length position =
        if position = goal then
            length
        else
            graph[position]
            |> List.filter (fun (p, _) -> not <| Set.contains p path)
            |> List.map (fun (p, cost) -> getMaxLength (Set.add p path) (length + cost) p)
            |> List.append [ -1 ]
            |> List.max

    getMaxLength ([ start ] |> Set) 0 start

let getLongestPathLength canClimb grid =
    let start = Vec.create 0 1
    let goal = Vec.create (Array2D.length1 grid - 1) (Array2D.length2 grid - 2)

    grid |> buildGraph canClimb |> getMaxPathLength start goal

let solve (input: string array) =
    let grid = input |> Grid.fromRows

    let result1 = grid |> getLongestPathLength false
    let result2 = grid |> getLongestPathLength true

    result1, result2, 2246, 6622

DayUtils.runDay solve
