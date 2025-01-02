module Year2024.Day7

let rec findMultiplier b multiplier =
    if multiplier > b then
        multiplier
    else
        findMultiplier b (multiplier * 10L)

let concat a b = a * (findMultiplier b 1L) + b

let isValid operators (target, numbers) =
    let rec check =
        function
        | [ n ] -> n = target
        | a :: b :: rest -> operators |> List.exists (fun op -> (op a b :: rest) |> check)
        | [] -> failwith $"Invalid input: {numbers}"

    numbers |> check

let solve =
    DayUtils.solveDay (fun input ->
        let equations = input |> Array.map (Input.parseAllLongs >> fun x -> x[0], x[1..])

        let valid, invalid = equations |> Array.partition (isValid [ (+); (*) ])
        let valid2 = invalid |> Array.filter (isValid [ (+); (*); concat ])

        let result1 = valid |> Array.sumBy fst
        let result2 = valid2 |> Array.sumBy fst |> (+) result1

        result1, result2, 1620690235709L, 145397611075341L)
