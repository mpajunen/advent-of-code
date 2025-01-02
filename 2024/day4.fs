module Year2024.Day4

open Vec2

let patternTiles =
    Grid.entries >> Seq.filter (fun (_, tile) -> tile <> '.') >> Seq.toList

let buildPatterns =
    List.collect (Grid.fromString >> Grid.rotations >> List.map patternTiles)

let xmasPatterns =
    [ """
XMAS
"""
      """
X...
.M..
..A.
...S
""" ]
    |> buildPatterns

let masXPatterns =
    [ """
M.S
.A.
M.S
""" ]
    |> buildPatterns

let gridMatches patterns grid =
    let tileMatches position =
        let matchesPattern =
            List.forall (fun (offset, tile) -> Grid.tryGet grid (position + offset) = Some tile)

        patterns |> List.filter matchesPattern |> List.length

    grid |> Grid.keys |> Seq.sumBy tileMatches

let solve = DayUtils.solveDay (fun input ->
    let grid = input |> Grid.fromRows

    let result1 = grid |> gridMatches xmasPatterns
    let result2 = grid |> gridMatches masXPatterns

    result1, result2, 2571, 1992)
