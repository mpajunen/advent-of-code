#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Input.fs"
#load "../fs-common/Vec2.fs"

open Vec2

type Operation =
    | Rect of int * int
    | RotateRow of int * int
    | RotateCol of int * int

let parseOperation =
    function
    | Input.ParseRegex "rect (\d+)x(\d+)" [ y; by ] -> Rect(int y, int by)
    | Input.ParseRegex "rotate row y=(\d+) by (\d+)" [ y; by ] -> RotateRow(int y, int by)
    | Input.ParseRegex "rotate column x=(\d+) by (\d+)" [ x; by ] -> RotateCol(int x, int by)
    | row -> failwith $"Unable to parse operation ${row}"

let rowCount = 6
let colCount = 50

let initialScreen = Array2D.create rowCount colCount false

let getTransform (screen: bool[,]) =
    function
    | Rect(x, y) -> fun p v -> p.Y < y && p.X < x || v
    | RotateRow(y, by) ->
        fun p v ->
            if p.Y = y then
                screen[y, (p.X - by + colCount) % colCount]
            else
                v
    | RotateCol(x, by) ->
        fun p v ->
            if p.X = x then
                screen[(p.Y - by + rowCount) % rowCount, x]
            else
                v

let applyInstruction screen instruction =
    Grid.mapi (getTransform screen instruction) screen

let correctCode =
    "
.##..####.#....####.#.....##..#...#####..##...###.
#..#.#....#....#....#....#..#.#...##....#..#.#....
#....###..#....###..#....#..#..#.#.###..#....#....
#....#....#....#....#....#..#...#..#....#.....##..
#..#.#....#....#....#....#..#...#..#....#..#....#.
.##..#....####.####.####..##....#..#.....##..###.."

let pixel on = if on then '#' else '.'

let solve (input: string array) =
    let operations = input |> Array.map parseOperation

    let screen = operations |> Array.fold applyInstruction initialScreen

    let result1 = screen |> Grid.countOf ((=) true)
    let result2 = screen |> Array2D.map pixel |> Grid.toString |> sprintf "\n%s"

    result1, result2, 106, correctCode

DayUtils.runDay solve
