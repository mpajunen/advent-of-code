module Year2025.Day4

open Vec2

let isAccessible (grid: Grid<char>) (pos: Vec) =
    Grid.get grid pos = '@'
    && Grid.adjacentAll grid pos |> List.filter ((=) '@') |> List.length < 4

let getAccessible grid =
    Grid.keys grid |> Seq.filter (isAccessible grid) |> Seq.toList

let rec getRemovableCount grid =
    match getAccessible grid with
    | [] -> 0
    | accessible ->
        accessible |> List.iter (fun p -> Grid.set grid p 'x') // Mutates!

        accessible.Length + getRemovableCount grid

let solve =
    DayUtils.solveDay (fun input ->
        let grid = input |> Grid.fromRows

        let result1 = grid |> getAccessible |> List.length
        let result2 = grid |> getRemovableCount

        result1, result2, 1527, 8690)
