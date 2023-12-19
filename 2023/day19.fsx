#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"

module Range =
    let length (a, b) = if b >= a then b - a + 1 else 0

    let splitFrom (a, b) n = (a, min b (n - 1)), (max a n, b)

let rec split splitter (input: 'a array) =
    match Array.tryFindIndex splitter input with
    | Some n -> input[.. n - 1] :: split splitter input[n + 1 ..]
    | None -> [ input ]

type Condition = { Op: char; Category: char; Num: int }

type Rule =
    | Branch of Condition * Rule * Rule
    | Decision of bool

type PartRange = Map<char, int * int>

let parseCondition (s: string) =
    { Category = s[0]
      Op = s[1]
      Num = s[2..] |> int }

let parseWorkflow (row: string) =
    let parts = row[.. row.Length - 2].Split("{")
    let rules = parts[1].Split(",") |> Array.toList

    parts[0], rules

module RuleTree =
    let build (rows: string array) =
        let raw = rows |> Array.map parseWorkflow |> Map

        let rec buildNode (rules: string list) =
            match rules with
            | [] -> failwith "Invalid rule!"
            | [ final ] -> buildGoal final
            | next :: rest ->
                next.Split(":")
                |> fun p -> Branch(parseCondition p[0], buildGoal p[1], buildNode rest)

        and buildGoal =
            function
            | "A" -> Decision true
            | "R" -> Decision false
            | name -> buildNode raw[name]

        buildNode raw["in"]

    let rec prune =
        function
        | Branch(condition, l, r) ->
            match prune l, prune r with
            | Decision true, Decision true -> Decision true
            | Decision false, Decision false -> Decision false
            | left, right -> Branch(condition, left, right)
        | leaf -> leaf

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

let rec evaluate tree range =
    match tree with
    | Decision success -> if success then comboCount range else 0L
    | Branch(condition, left, right) ->
        range
        |> splitPartRange condition
        |> fun (matching, nonMatching) -> evaluate left matching + evaluate right nonMatching

let rating = Map.values >> Seq.sumBy fst

let COMBINATION = "xmas".ToCharArray() |> Array.map (fun c -> c, (1, 4000)) |> Map

let solve (input: string array) =
    let split = input |> split ((=) "")

    let tree = split[0] |> RuleTree.build |> RuleTree.prune
    let parts = split[1] |> Array.map parsePart

    let result1 = parts |> Array.filter (evaluate tree >> (=) 1L) |> Array.sumBy rating
    let result2 = evaluate tree COMBINATION

    result1, result2, 346230, 124693661917133L

DayUtils.runDay solve
