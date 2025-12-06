module Year2025.Day6

let tryNumber chars =
    match Array.filter ((<>) ' ') chars with
    | [||] -> None
    | filtered -> Some(System.String filtered |> int64)

let splitProblemNumbers acc =
    function
    | None -> [] :: acc
    | Some n ->
        match acc with
        | [] -> [ [ n ] ]
        | head :: tail -> (n :: head) :: tail

let parseInput (input: string[]) =
    let numberRows, operatorRows = input |> Array.splitAt (input.Length - 1)

    let numbers1 =
        numberRows |> Array.map Input.parseAllLongs |> array2D |> Vec2.Grid.cols

    let numbers2 =
        numberRows
        |> array2D
        |> Vec2.Grid.cols
        |> Array.map tryNumber
        |> Array.fold splitProblemNumbers [ [] ]
        |> List.rev
        |> List.toArray
        |> Array.map List.toArray

    let operators = operatorRows[0] |> Seq.filter (fun c -> c <> ' ') |> Seq.toArray

    Array.zip numbers1 operators, Array.zip numbers2 operators

let parseOperator =
    function
    | '+' -> (+)
    | '*' -> (*)
    | _ -> failwith "Unknown operator"

let solveProblem (numbers, operator) =
    Array.reduce (parseOperator operator) numbers

let solve =
    DayUtils.solveDay (fun input ->
        let problems1, problems2 = parseInput input

        let result1 = problems1 |> Array.map solveProblem |> Array.sum
        let result2 = problems2 |> Array.map solveProblem |> Array.sum

        result1, result2, 4405895212738L, 7450962489289L)
