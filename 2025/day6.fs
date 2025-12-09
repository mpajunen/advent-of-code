module Year2025.Day6

let splitOn (predicate: 'a -> bool) (source: 'a array) =
    let loop item =
        function
        | [] -> [ [ item ] ]
        | head :: tail ->
            if predicate item then
                [] :: head :: tail
            else
                (item :: head) :: tail

    Array.foldBack loop source [] |> List.map List.toArray |> List.toArray

let parseNumber = Array.filter ((<>) ' ') >> System.String >> int64

let parseOperator =
    function
    | '+' -> (+)
    | '*' -> (*)
    | _ -> failwith "Unknown operator"

let parseProblem (cols: char[][]) =
    let rows = cols |> array2D |> Vec2.Grid.cols

    rows[rows.Length - 1] |> Seq.find ((<>) ' ') |> parseOperator,
    rows |> Array.take (rows.Length - 1) |> Array.map parseNumber,
    cols |> Array.map (Array.take (rows.Length - 1) >> parseNumber)

let parseInput =
    array2D
    >> Vec2.Grid.cols
    >> splitOn (Seq.forall ((=) ' '))
    >> Array.map parseProblem

let solve =
    DayUtils.solveDay (fun input ->
        let problems = parseInput input

        let result1 = problems |> Array.sumBy (fun (op, rows, _) -> Array.reduce op rows)
        let result2 = problems |> Array.sumBy (fun (op, _, cols) -> Array.reduce op cols)

        result1, result2, 4405895212738L, 7450962489289L)
