module Year2025.Day6

let parseInput (input: string[]) =
    let numberRows, operatorRows = input |> Array.splitAt (input.Length - 1)

    let numbers =
        numberRows |> Array.map Input.parseAllLongs |> array2D |> Vec2.Grid.cols

    let operators = operatorRows[0] |> Seq.filter (fun c -> c <> ' ') |> Seq.toArray

    Array.zip numbers operators

let parseOperator =
    function
    | '+' -> (+)
    | '*' -> (*)
    | _ -> failwith "Unknown operator"

let solveProblem (numbers, operator) =
    Array.reduce (parseOperator operator) numbers

let solve =
    DayUtils.solveDay (fun input ->
        let problems = parseInput input

        let result1 = problems |> Array.map solveProblem |> Array.sum
        let result2 = 0L

        result1, result2, 4405895212738L, 0L)
