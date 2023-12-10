#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Vec2.fs"

open Vec2

// Expand grid to allow flood fill to reach gaps between pipes
let expand (grid: Grid<char>) =
    let init y x =
        if y % 2 = 0 || x % 2 = 0 then '.' else grid[y / 2, x / 2]

    Array2D.init (Array2D.length1 grid * 2 + 1) (Array2D.length2 grid * 2 + 1) init

// Compact expanded grid
let compact (expanded: Grid<char>) =
    let init y x = expanded[y * 2 + 1, x * 2 + 1]

    Array2D.init (Array2D.length1 expanded / 2) (Array2D.length2 expanded / 2) init

let changeFacing facing pipe =
    match pipe, facing with
    | 'L', Dir.Down -> Dir.Right
    | 'L', Dir.Left -> Dir.Up
    | 'J', Dir.Down -> Dir.Left
    | 'J', Dir.Right -> Dir.Up
    | '7', Dir.Right -> Dir.Down
    | '7', Dir.Up -> Dir.Left
    | 'F', Dir.Up -> Dir.Right
    | 'F', Dir.Left -> Dir.Down
    | _, facing -> facing

// Replace main loop pipe characters with ' '
let buildLoop grid =
    let moveStep a =
        Grid.set grid a.Position ' '
        a |> Actor.forward

    let move before =
        let a = before |> moveStep |> moveStep // Double move on expanded grid

        { a with
            Facing = Grid.get grid a.Position |> changeFacing a.Facing }

    let mutable animal =
        { Position = grid |> Grid.findKey ((=) 'S')
          Facing = Dir.Right // TODO determine
        }

    while Grid.get grid animal.Position <> ' ' do
        animal <- animal |> move

    grid

let adjacent y x =
    [ (y + 1, x); (y - 1, x); (y, x + 1); (y, x - 1) ]

// Fill outside of the main loop with ' '
let fillOutside (grid: Grid<char>) =
    let isInBounds (y, x) =
        y >= 0 && x >= 0 && y < Array2D.length1 grid && x < Array2D.length2 grid

    let rec fillFrom (y, x) =
        if grid[y, x] <> ' ' then
            grid[y, x] <- ' '

            adjacent y x |> List.filter isInBounds |> List.iter fillFrom

    fillFrom (0, 0)

    grid

let solve (input: string array) =
    let original = input |> Array.map _.ToCharArray() |> array2D
    let withLoop = original |> expand |> buildLoop

    let result1 = (withLoop |> Grid.countOf ((=) ' ')) / 4 // Expanded grid, half way around the loop
    let result2 = withLoop |> fillOutside |> compact |> Grid.countOf ((<>) ' ')

    result1, result2, 6886, 371

DayUtils.runDay solve
