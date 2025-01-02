module Year2024.Day21

open Vec2

let dirToChar =
    function
    | Dir.Down -> 'v'
    | Dir.Up -> '^'
    | Dir.Left -> '<'
    | Dir.Right -> '>'

let getAllShortest (pad: (Vec * char) seq) =
    let map = pad |> Map

    let rec find from till =
        if from = till then
            [ [] ]
        else
            let getNext (dir: Dir) =
                if map.ContainsKey(from + dir) then
                    find (from + dir) till |> List.map (fun path -> (dirToChar dir) :: path)
                else
                    []

            let horizontal =
                match till.X - from.X with
                | n when n > 0 -> getNext Dir.Right
                | n when n < 0 -> getNext Dir.Left
                | _ -> []

            let vertical =
                match till.Y - from.Y with
                | n when n > 0 -> getNext Dir.Down
                | n when n < 0 -> getNext Dir.Up
                | _ -> []

            horizontal @ vertical

    let fromMoves from =
        pad
        |> Seq.map (fun (p, c) -> c, find from p |> List.map (fun s -> s @ [ 'A' ]))
        |> Map

    pad |> Seq.map (fun (p, c) -> c, fromMoves p) |> Map

let getPadMoves (pad: string) =
    pad.Trim()
    |> Grid.fromString
    |> Grid.entries
    |> Seq.filter (fun (_, c) -> c <> '.')
    |> getAllShortest

let numericPad =
    """
789
456
123
.0A"""
    |> getPadMoves

let directionPad =
    """
.^A
<v>"""
    |> getPadMoves

let getKeyMoves keys = 'A' :: keys |> List.pairwise

let rec getSecShortest' recur (maxDepth, depth) buttons =
    let getShortest (from, till) =
        let pad = if depth = maxDepth then numericPad else directionPad
        let options = pad[from][till]

        match depth with
        | 0 -> options[0].Length |> int64
        | n -> options |> List.map (recur (maxDepth, n - 1)) |> List.min

    buttons |> getKeyMoves |> List.map getShortest |> List.sum

let getSecShortest = Func.memoizeRec2 getSecShortest'

let complexity (code: string, buttons) = (code[0..2] |> int64) * buttons

let getMinComplexity depth input =
    input
    |> Array.map (Seq.toList >> getSecShortest (depth, depth))
    |> Array.zip input
    |> Array.sumBy complexity

let solve = DayUtils.solveDay (fun input ->
    let result1 = input |> getMinComplexity 2
    let result2 = input |> getMinComplexity 25

    result1, result2, 177814, 220493992841852L)
