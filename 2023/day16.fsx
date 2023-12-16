#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Vec2.fs"

open System.Collections.Generic
open Vec2

let changeFacing layout beam =
    match Grid.get layout beam.Position, beam.Facing with
    | '/', Dir.Down -> [ Dir.Left ]
    | '/', Dir.Left -> [ Dir.Down ]
    | '/', Dir.Right -> [ Dir.Up ]
    | '/', Dir.Up -> [ Dir.Right ]
    | '\\', Dir.Down -> [ Dir.Right ]
    | '\\', Dir.Left -> [ Dir.Up ]
    | '\\', Dir.Right -> [ Dir.Down ]
    | '\\', Dir.Up -> [ Dir.Left ]
    | '-', Dir.Up -> [ Dir.Left; Dir.Right ]
    | '-', Dir.Down -> [ Dir.Left; Dir.Right ]
    | '|', Dir.Left -> [ Dir.Down; Dir.Up ]
    | '|', Dir.Right -> [ Dir.Down; Dir.Up ]

    | _, facing -> [ facing ]

let energize (layout: Grid<char>) start =
    let moved = Dictionary()
    let energized = Dictionary()

    let rec move beam =
        match moved.TryGetValue(beam) with
        | false, _ ->
            moved[beam] <- true
            energized[beam.Position] <- true

            beam
            |> changeFacing layout
            |> List.map (fun facing -> { beam with Facing = facing })
            |> List.map Actor.forward
            |> List.filter (_.Position >> Grid.isWithin layout)
            |> List.iter move
        | _ -> ()

    move start

    energized.Count

let initial =
    { Position = origin
      Facing = Dir.Right }

let startOptions layout =
    let yMax = Array2D.length1 layout - 1
    let xMax = Array2D.length2 layout - 1

    let options =
        [ for y in 0 .. yMax - 1 do
              yield y, 0, Dir.Right
              yield y, xMax, Dir.Left
          for x in 0 .. xMax - 1 do
              yield 0, x, Dir.Down
              yield yMax, x, Dir.Up ]

    options |> List.map (fun (y, x, facing) -> Actor.create y x facing)

let solve (input: string array) =
    let layout = input |> Grid.fromRows

    let result1 = initial |> energize layout
    let result2 = startOptions layout |> List.map (energize layout) |> List.max

    result1, result2, 6514, 8089

DayUtils.runDay solve
