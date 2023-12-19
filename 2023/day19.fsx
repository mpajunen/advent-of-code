#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"

let rec split splitter (input: 'a array) =
    match Array.tryFindIndex splitter input with
    | Some n -> input[.. n - 1] :: split splitter input[n + 1 ..]
    | None -> [ input ]

type Goal =
    | Approval of bool
    | Workflow of string

type Condition = { Op: char; Category: char; Num: int }

type Rule = Condition option * Goal

type Part = Map<char, int>

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
    |> Array.map (_.Split("=") >> fun rating -> rating[0][0], int rating[1])
    |> Map

let matchesCondition cond (part: Part) =
    match cond.Op with
    | '<' -> part[cond.Category] < cond.Num
    | '>' -> part[cond.Category] > cond.Num
    | _ -> failwith "Invalid operation!"

let evaluate (workflows: Map<string, Rule array>) (part: Part) =
    let rec evalRule (workflow: Rule array) =
        match workflow[0] with
        | None, goal -> evalGoal goal
        | Some cond, goal ->
            if matchesCondition cond part then
                evalGoal goal
            else
                evalRule workflow[1..]

    and evalGoal goal =
        match goal with
        | Workflow name -> evalRule workflows[name]
        | Approval success -> success

    evalRule workflows["in"]

let rating = Map.values >> Seq.sum

let COMBINATION = "xmas".ToCharArray() |> Array.map (fun c -> c, (1, 4000)) |> Map

let solve (input: string array) =
    let split = input |> split ((=) "")

    let workflows = split[0] |> Array.map parseWorkflow |> Map
    let parts = split[1] |> Array.map parsePart

    let result1 = parts |> Array.filter (evaluate workflows) |> Array.sumBy rating
    let result2 = 0

    result1, result2, 346230, 0

DayUtils.runDay solve
