#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Vec2.fs"

open System.Collections.Generic

open Vec2

let getStates moves (reindeer, points) =
    List.map (fun (action, cost) -> action reindeer, points + cost) moves

let next =
    [ Actor.forward, 1
      Actor.turn Left >> Actor.forward, 1001
      Actor.turn Right >> Actor.forward, 1001 ]

let previous =
    [ Actor.backward, -1
      Actor.backward >> Actor.turn Left, -1001
      Actor.backward >> Actor.turn Right, -1001 ]

let getRoutes maze =
    let routes = Dictionary()

    let getNext =
        getStates next >> List.filter (fun (r, _) -> Grid.get maze r.Position <> '#')

    let start = maze |> Grid.findKey ((=) 'S')
    let mutable frontier = [ { Position = start; Facing = Dir.Right }, 0 ]

    while frontier.Length > 0 do
        let reindeer, points = frontier |> List.head

        frontier <- frontier |> List.tail

        match routes.TryGetValue reindeer with
        | true, p when p <= points -> ()
        | _ ->
            routes[reindeer] <- points

            frontier <- (reindeer, points) |> getNext |> (@) frontier |> List.sortBy snd

    routes

let getPositionEntries (routes: Dictionary<Actor, int>) position =
    routes
    |> Seq.filter (fun pair -> pair.Key.Position = position)
    |> Seq.map (fun pair -> pair.Key, pair.Value)

let getFinish maze routes =
    let all = maze |> Grid.findKey ((=) 'E') |> getPositionEntries routes
    let minimum = all |> Seq.map snd |> Seq.min

    all |> Seq.filter (fun (_, points) -> points = minimum) |> Seq.toList

let getBestPlaces finish (routes: Dictionary<Actor, int>) =
    let rec getPaths (reindeer, points) =
        match routes.TryGetValue reindeer with
        | true, p when p = points ->
            reindeer.Position
            :: (List.collect getPaths <| getStates previous (reindeer, points))
        | _ -> []

    finish |> List.collect getPaths |> List.distinct

DayUtils.runDay (fun input ->
    let maze = input |> Grid.fromRows

    let routes = maze |> getRoutes
    let finish = routes |> getFinish maze

    let result1 = snd finish[0]
    let result2 = getBestPlaces finish routes |> List.length

    result1, result2, 114476, 508)
