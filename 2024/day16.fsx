#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Vec2.fs"

open System.Collections.Generic

open Vec2

let getRoutes maze =
    let routes = Dictionary()

    let getNext (reindeer, steps) =
        [ reindeer |> Actor.forward, steps + 1
          reindeer |> Actor.turn Left |> Actor.forward, steps + 1001
          reindeer |> Actor.turn Right |> Actor.forward, steps + 1001 ]
        |> List.filter (fun (r, _) -> Grid.get maze r.Position <> '#')

    let start = maze |> Grid.findKey ((=) 'S')
    let mutable frontier = [ { Position = start; Facing = Dir.Right }, 0 ]

    while frontier.Length > 0 do
        let reindeer, steps = frontier |> List.head

        frontier <- frontier |> List.tail

        match routes.TryGetValue reindeer with
        | true, s when s <= steps -> ()
        | _ ->
            routes[reindeer] <- steps

            let next = (reindeer, steps) |> getNext

            frontier <- (next @ frontier) |> List.sortBy snd

    routes

let getPositionEntries (routes: Dictionary<Actor, int>) position =
    routes
    |> Seq.filter (fun pair -> pair.Key.Position = position)
    |> Seq.map (fun pair -> pair.Key, pair.Value)

let getFinish maze routes =
    maze |> Grid.findKey ((=) 'E') |> getPositionEntries routes |> Seq.toList

let getBestPlaces finish (routes: Dictionary<Actor, int>) =
    let getPrevious (reindeer, steps) =
        [ reindeer |> Actor.backward, steps - 1
          reindeer |> Actor.backward |> Actor.turn Left, steps - 1001
          reindeer |> Actor.backward |> Actor.turn Right, steps - 1001 ]

    let rec getPaths (reindeer, steps) =
        match routes.TryGetValue reindeer with
        | true, s when s = steps -> reindeer.Position :: (List.collect getPaths <| getPrevious (reindeer, steps))
        | _ -> []

    finish |> List.collect getPaths |> List.distinct

DayUtils.runDay (fun input ->
    let maze = input |> Grid.fromRows

    let routes = maze |> getRoutes
    let finish = routes |> getFinish maze

    let result1 = finish |> Seq.map snd |> Seq.min
    let result2 = getBestPlaces finish routes |> List.length

    result1, result2, 114476, 508)
