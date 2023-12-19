#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"

module Range =
    let length (a, b) = if b >= a then b - a + 1 else 0

    let splitFrom (a, b) n = (a, min b (n - 1)), (max a n, b)

let rec split splitter (input: 'a array) =
    match Array.tryFindIndex splitter input with
    | Some n -> input[.. n - 1] :: split splitter input[n + 1 ..]
    | None -> [ input ]

type Goal =
    | Approval of bool
    | Workflow of string

type Condition = { Op: char; Category: char; Num: int }

type Rule = Condition option * Goal

type PartRange = Map<char, int * int>

let parseGoal =
    function
    | "A" -> Approval true
    | "R" -> Approval false
    | s -> Workflow s

let parseRule (s: string) =
    let parts = s.Split(":") |> Array.rev

    let goal = parts[0] |> parseGoal

    if parts.Length = 1 then
        None, goal
    else
        Some
            { Category = parts[1][0]
              Op = parts[1][1]
              Num = parts[1][2..] |> int },
        goal

let parseWorkflow (row: string) =
    let parts = row[.. row.Length - 2].Split("{")
    let rules = parts[1].Split(",") |> Array.map parseRule

    parts[0], rules

let parsePart (row: string) =
    row[1 .. row.Length - 2].Split(",")
    |> Array.map (_.Split("=") >> fun rating -> rating[0][0], (int rating[1], int rating[1]))
    |> Map

let splitPartRange cond (range: PartRange) =
    let matching, nonMatching =
        match cond.Op with
        | '<' -> Range.splitFrom range[cond.Category] cond.Num
        | '>' -> Range.splitFrom range[cond.Category] (cond.Num + 1) |> fun (a, b) -> b, a
        | _ -> failwith "Invalid operation!"

    range |> Map.add cond.Category matching, range |> Map.add cond.Category nonMatching

let comboCount =
    Map.values >> Seq.map Range.length >> Seq.map int64 >> Seq.reduce (*)

let evaluate (workflows: Map<string, Rule array>) =
    let rec evalRule (workflow: Rule array) range =
        match workflow[0] with
        | None, goal -> range |> evalGoal goal
        | Some condition, goal ->
            let matching, nonMatching = range |> splitPartRange condition

            (matching |> evalGoal goal) + (nonMatching |> evalRule workflow[1..])

    and evalGoal goal range =
        match goal with
        | Workflow name -> evalRule workflows[name] range
        | Approval success -> if success then comboCount range else 0L

    evalRule workflows["in"]

let rating = Map.values >> Seq.sumBy fst

let COMBINATION = "xmas".ToCharArray() |> Array.map (fun c -> c, (1, 4000)) |> Map

let solve (input: string array) =
    let split = input |> split ((=) "")

    let workflows = split[0] |> Array.map parseWorkflow |> Map
    let parts = split[1] |> Array.map parsePart

    let result1 =
        parts |> Array.filter (evaluate workflows >> (=) 1L) |> Array.sumBy rating

    let result2 = COMBINATION |> evaluate workflows

    result1, result2, 346230, 124693661917133L

DayUtils.runDay solve
